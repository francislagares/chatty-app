import { databaseConnection } from '@/config/database';
import 'module-alias/register';
import express from 'express';
import { ChattyServer } from '@/server';
import { config } from '@/config';

class Application {
  public launch(): void {
    this.loadConfig();
    databaseConnection();
    const app = express();
    const server = new ChattyServer(app);

    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application = new Application();
application.launch();
