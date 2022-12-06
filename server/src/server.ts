import {
  CustomError,
  IErrorResponse,
} from './shared/global/helpers/ErrorHandler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import logger from '@/utils/logger';
import {
  Application,
  Request,
  Response,
  NextFunction,
  json,
  urlencoded,
} from 'express';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import { Server as HTTPServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import { Server as SocketServer } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { config } from '@/config';
import applicationRoutes from '@/routes';

const SERVER_PORT = 5000;
export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [
          config.SECRET_KEY_ONE as string,
          config.SECRET_KEY_TWO as string,
        ],
        maxAge: 24 * 7 * 3_600_000,
        secure: config.NODE_ENV !== 'development',
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found.`,
      });
    });

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        logger.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
      },
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new HTTPServer(app);
      const socketIO = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnection(socketIO);
    } catch (error) {
      logger.error(error);
    }
  }

  private async createSocketIO(httpServer: HTTPServer): Promise<SocketServer> {
    const io = new SocketServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }

  private startHttpServer(httpServer: HTTPServer): void {
    logger.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Server listening on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnection(_io: SocketServer): void {
    logger.info('Socket connected');
  }
}
