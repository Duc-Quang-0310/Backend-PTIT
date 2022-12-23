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
import { Profiles } from '@/interfaces/profiles.interface';

class AuthService {
  public async signup(userData: SignUpUserDto): Promise<boolean> {
    if (isEmpty(userData))
      throw new HttpException(400, 'body cannot empty is empty');

    const findUser: User = await userModel.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(409, `Email ${userData.email} đã tồn tại`);

    const { email, password, role, status, firstName, lastName } = userData;
    const hashedPassword = await hash(password, 12);
    const mail = split(email, '@')[0];

    const newUser: User = await userModel.create({
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
      status: status || UserStatus.ACTIVE,
    });

    await Promise.all([
      ProfileModel.create({
        firstName: firstName,
        lastName: lastName || mail,
        avatar: DEFAULT_IMG_LINK,
        userId: newUser._id,
      }),
    ]);

    return true;
  }

  public async login(userData: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userInfo: User;
    profile: Profiles;
  }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Input is empty');

    const userInfo: User = await userModel.findOne({ email: userData.email });
    if (!userInfo)
      throw new HttpException(409, `Email ${userData.email} không tồn tại`);

    const isPasswordMatching: boolean = await compare(
      userData.password,
      userInfo.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(409, 'Sai tài khoản hoặc mật khẩu');

    const accessToken = await this.generateToken(
      userInfo.email,
      TokenType.ACCESS,
    );
    const profile: Profiles = await ProfileModel.findOne({
      userId: userInfo._id,
    });

    const refreshToken = await this.generateRefreshToken(userInfo);
    return { accessToken, refreshToken, userInfo, profile };
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

  public async genNewToken(user: User) {
    const accessToken = await this.generateToken(user.email, TokenType.ACCESS);

    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  public async getAllProfileContent(): Promise<Profiles[]> {
    return ProfileModel.find();
  }

  public async recoverPassword(
    email: string,
    password: string,
  ): Promise<string> {
    const userInfo: User = await userModel.findOne({ email });

    if (!userInfo) {
      throw new HttpException(409, `Email ${email} không tồn tại`);
    }

    const profile = await ProfileModel.findOne({ userId: userInfo?._id });

    if (!profile) {
      throw new HttpException(409, `Tài khoản với ${email} không tồn tại`);
    }

    const hashedPassword = await hash(password, 12);
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 189 ~ AuthService ~ hashedPassword',
      hashedPassword,
    );

    await userModel.findByIdAndUpdate(userInfo?._id, {
      email,
      password: hashedPassword,
      createdAt: userInfo.createdAt,
      updatedAt: new Date(),
      role: userInfo.role,
      status: userInfo.status,
      token: userInfo.token,
    });

    return 'Lấy lại tài khoản thành công';
  }

  public async changePasswordService(
    oldPassword: string,
    newPassword: string,
    userId: string,
  ): Promise<string> {
    if (!userId) {
      throw new HttpException(409, `Cần có user ID`);
    }

    if (!oldPassword) {
      throw new HttpException(409, `Cần có mật khẩu cũ`);
    }

    if (!newPassword) {
      throw new HttpException(409, `Cần có mật khẩu mới`);
    }

    const userInfo = await userModel.findById(userId);

    if (!userInfo) {
      throw new HttpException(409, `User ID không tồn tại`);
    }

    const isPasswordMatching: boolean = await compare(
      oldPassword,
      userInfo.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(409, `Mật khẩu cũ không đúng`);
    }

    const hashedPassword = await hash(newPassword, 12);

    await userModel.findByIdAndUpdate(userInfo?._id, {
      email: userInfo.email,
      password: hashedPassword,
      createdAt: userInfo.createdAt,
      updatedAt: new Date(),
      role: userInfo.role,
      status: userInfo.status,
      token: userInfo.token,
    });

    return 'Đổi mật khẩu thành công';
  }
}

export default AuthService;
