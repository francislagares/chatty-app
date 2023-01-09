import { CurrentUser } from '@/features/auth/controllers/CurrentUser';
import { authMiddleware } from '@/shared/global/helpers/AuthMiddleware';
import express, { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/me',
      authMiddleware.checkAuthentication,
      CurrentUser.prototype.getCurrentUser,
    );

    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
