import * as jwt from 'jsonwebtoken';

export class JwtService {
  constructor(private readonly JWT_ACCESS_SECRET: string) {}

  decode(token: string): any {
    try {
      return jwt.verify(token, this.JWT_ACCESS_SECRET);
    } catch (error) {
      return undefined;
    }
  }
}