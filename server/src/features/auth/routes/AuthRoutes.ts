import { SignUp } from '@/features/auth/controllers/SignUp';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);

    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
