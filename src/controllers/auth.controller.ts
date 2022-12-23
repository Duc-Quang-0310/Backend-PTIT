import { NextFunction, Request, Response } from 'express';
import {
  CheckEmailExistDto,
  LoginUserDto,
  SignUpUserDto,
} from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignUpUserDto = req.body;
      const signUpUserData = await this.authService.signup(userData);

      res.status(201).json({
        success: signUpUserData,
        message: 'Tạo mới tài khoản thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { accessToken, refreshToken, userInfo, profile } =
        await this.authService.login(userData);

      res.status(200).json({
        data: { userInfo, profile },
        message: 'Đăng nhập thành công',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public CheckEmailExist = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email }: CheckEmailExistDto = req.body;
      const result = await this.authService.checkEmailExist(email);
      res.status(200).json({ exist: result });
    } catch (error) {
      next(error);
    }
  };

  public regenerateAccessToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      const { accessToken, refreshToken } = await this.authService.genNewToken(
        user,
      );
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  public getAllProfile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.authService.getAllProfileContent();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public passwordRecover = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email = '', password = '' } = req.body;
      const data = await this.authService.recoverPassword(email, password);
      res.status(200).json({ message: data });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { oldPassword = '', newPassword = '', userId = '' } = req.body;
      const data = await this.authService.changePasswordService(
        oldPassword,
        newPassword,
        userId,
      );
      res.status(200).json({ message: data });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
