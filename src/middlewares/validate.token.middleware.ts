import env from '@/config/env';
import { HttpException } from '@/exceptions/HttpException';
import { TokenType } from '@/interfaces/auth.interface';
import { TokenDecode } from '@/interfaces/tokens.interface';
import { User } from '@/interfaces/users.interface';
import UserModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';

enum JWTAlgorithm {
  HS256 = 'HS256',
  HS512 = 'HS512',
}

const validateRefreshTokenInfo = async (
  email: string,
  jwtToken: string,
): Promise<{
  success: boolean;
  user?: User;
}> => {
  const currentUser: User = await UserModel.findOne({ email });
  const token = currentUser.token;

  if (currentUser === null) {
    return {
      success: false,
    };
  }
  if (token === null) {
    return {
      success: false,
    };
  }
  if (token.trim() !== jwtToken.trim()) {
    return {
      success: false,
    };
  }

  return {
    success: false,
    user: currentUser,
  };
};

const validateExpireToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers && req.headers.authorization) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    const json = jwt.decode(jwtToken);
    const decodeToken = json as TokenDecode;
    const type = decodeToken.type;

    try {
      const user = jwt.verify(jwtToken, env.jwtSecret, {
        algorithms:
          type === TokenType.ACCESS
            ? ([JWTAlgorithm.HS256] as Algorithm[])
            : ([JWTAlgorithm.HS512] as Algorithm[]),
      });
      const userInfo = user as TokenDecode;
      const userEmail = userInfo.user;

      if (type === TokenType.REFRESH) {
        const passAllCase = await validateRefreshTokenInfo(userEmail, jwtToken);
        if (!passAllCase.success) {
          req['user'] = passAllCase?.user || {};
          return next(new HttpException(401, `${type} Token Expired`));
        }
      }
      return next();
    } catch (error) {
      return next(new HttpException(401, `${type} Token Expired`));
    }
  }
  return next(new HttpException(401, 'Unauthorized'));
};

export default validateExpireToken;
