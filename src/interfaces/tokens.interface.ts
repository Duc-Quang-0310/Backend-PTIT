import { JwtPayload } from 'jsonwebtoken';

export interface TokenDecode extends JwtPayload {
  type?: string;
  user?: string;
}
