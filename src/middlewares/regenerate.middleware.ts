import jwt from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import { TokenType } from '@/interfaces/auth.interface';
import { TokenDecode } from '@/interfaces/tokens.interface';
import UserModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';

const authenRegenerate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.headers && req.headers.authorization) {
    const json = jwt.decode(req.headers.authorization.split(' ')[1]);
    const tokenDecode = json as TokenDecode;
    const type = tokenDecode.type;
    const email = tokenDecode.user;

    if (!type || type !== TokenType.REFRESH) {
      return next(new HttpException(401, 'UnauthorizedError'));
    }

    if (!email) {
      return next(new HttpException(401, 'UnauthorizedError'));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new HttpException(401, 'UnauthorizedError'));
    }

    return next();
  }
  return next(new HttpException(401, 'UnauthorizedError'));
};

export default authenRegenerate;
