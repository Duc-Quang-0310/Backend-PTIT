import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, UserRole, UserStatus } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { LoginUserDto, SignUpUserDto } from '@/dtos/users.dto';
import ProfileModel, { DEFAULT_IMG_LINK } from '@/models/profiles.model';
import { split } from 'lodash';

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
  ): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await userModel.findOne({ email: userData.email });
    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`,
      );

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
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

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
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
