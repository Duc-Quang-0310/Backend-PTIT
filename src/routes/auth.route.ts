import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { SignUpUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/api/user/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}sign-up`,
      validationMiddleware(SignUpUserDto, 'body'),
      this.authController.signUp,
    );
    this.router.post(
      `${this.path}log-in`,
      validationMiddleware(LoginUserDto, 'body'),
      this.authController.logIn,
    );
    this.router.post(
      `${this.path}log-out`,
      authMiddleware,
      this.authController.logOut,
    );
  }
}

export default AuthRoute;
