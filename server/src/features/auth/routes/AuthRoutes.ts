import { SignOut } from '@/features/auth/controllers/SignOut';
import { SignIn } from '@/features/auth/controllers/SignIn';
import { SignUp } from '@/features/auth/controllers/SignUp';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.login);

    return this.router;
  }

  public signOutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.logout);

    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
