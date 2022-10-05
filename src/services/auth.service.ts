import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import {
  DataStoredInToken,
  TokenData,
  TokenType,
} from '@interfaces/auth.interface';
import { User, UserRole, UserStatus } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { LoginUserDto, SignUpUserDto } from '@/dtos/users.dto';
import ProfileModel, { DEFAULT_IMG_LINK } from '@/models/profiles.model';
import { split } from 'lodash';
import { logger } from '@/utils/logger';
import env from '@/config/env';

class AuthService {
  public async signup(userData: SignUpUserDto): Promise<boolean> {
    if (isEmpty(userData))
      throw new HttpException(400, 'body cannot empty is empty');

    const findUser: User = await userModel.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} already exists`,
      );

    const { email, password, role, status, firstName, lastName } = userData;
    const hashedPassword = await hash(password, 12);
    const mail = split(email, '@')[0];
    await Promise.all([
      userModel.create({
        email,
        password: hashedPassword,
        role: role || UserRole.USER,
        status: status || UserStatus.ACTIVE,
      }),
      ProfileModel.create({
        firstName: firstName,
        lastName: lastName || mail,
        avatar: DEFAULT_IMG_LINK,
      }),
    ]);

    return true;
  }

  public async login(
    userData: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; userInfo: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Input is empty');

    const userInfo: User = await userModel.findOne({ email: userData.email });
    if (!userInfo)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`,
      );

    const isPasswordMatching: boolean = await compare(
      userData.password,
      userInfo.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(409, 'Password is not matching');

    const accessToken = await this.generateToken(
      userInfo.email,
      TokenType.ACCESS,
    );
    const refreshToken = await this.generateRefreshToken(userInfo);
    return { accessToken, refreshToken, userInfo };
  }

  public async generateToken(email: string, type: TokenType) {
    try {
      let token = '';
      if (type === 'Access') {
        token = sign({ user: email, type: TokenType.ACCESS }, env.jwtSecret, {
          expiresIn: env.jwtExpiredAccessTokenTime,
        });
      } else {
        token = sign(
          {
            user: email,
            type: TokenType.REFRESH,
          },
          env.jwtSecret,
          {
            algorithm: 'HS512',
            noTimestamp: true,
            expiresIn: env.jwtExpiredRefreshTokenTime,
          },
        );
      }
      return token;
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at generateToken()' });
    }
  }

  public async generateRefreshToken(user: User) {
    try {
      const refreshToken = await this.generateToken(
        user.email,
        TokenType.REFRESH,
      );
      await userModel.updateOne(
        { _id: user._id },
        { $set: { token: refreshToken } },
      );

      logger.info(`Generated Refresh Token for user: ${user.email}`);
      return refreshToken;
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at handleRefreshToken()' });
    }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await userModel.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`,
      );

    return findUser;
  }

  public createToken(userId: string): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: userId };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async checkEmailExist(email: string): Promise<boolean> {
    const findUser: User = await userModel.findOne({ email });
    return !!findUser;
  }
}

export default AuthService;
