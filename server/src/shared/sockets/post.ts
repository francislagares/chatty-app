import { Server, Socket } from 'socket.io';

import logger from '@/utils/logger';

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info('Post socket.io handler', socket);
    });
  }
}
