
import * as jwt from 'jsonwebtoken';

export class JwtService {
  private readonly JWT_ACCESS_SECRET: string;

  constructor(JWT_ACCESS_SECRET: string) {
    this.JWT_ACCESS_SECRET = JWT_ACCESS_SECRET;
  }

  verify(token: any): any {
    return jwt.verify(token, this.JWT_ACCESS_SECRET);
  }

  decode(token: string): any {
    try {
      return jwt.verify(token, this.JWT_ACCESS_SECRET);
    } catch (error) {
      return undefined;
    }
  }
}
