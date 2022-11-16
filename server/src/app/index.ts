import 'module-alias/register';
import express from 'express';
import { ChattyServer } from '@/server';
import { config } from '@/config';

class Application {
  public launch(): void {
    this.loadConfig();
    const app = express();
    const server = new ChattyServer(app);

    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application = new Application();
application.launch();
