import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import {
  SignUpUserDto,
  LoginUserDto,
  CheckEmailExistDto,
  ChangeAccountPasswordDto,
} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import validateExpireToken from '@/middlewares/validate.token.middleware';
import authenRegenerate from '@/middlewares/regenerate.middleware';

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
    this.router.post(
      `${this.path}email-check`,
      validationMiddleware(CheckEmailExistDto, 'body'),
      this.authController.CheckEmailExist,
    );
    this.router.post(
      `${this.path}gen-new-token`,
      validateExpireToken,
      authenRegenerate,
      this.authController.regenerateAccessToken,
    );
    this.router.get(
      `${this.path}get-all-profile`,
      this.authController.getAllProfile,
    );
    this.router.post(
      `${this.path}password-recover`,
      validationMiddleware(LoginUserDto, 'body'),
      this.authController.passwordRecover,
    );
    this.router.post(
      `${this.path}change-password`,
      validationMiddleware(ChangeAccountPasswordDto, 'body'),
      this.authController.changePassword,
    );
  }
}

export default AuthRoute;
