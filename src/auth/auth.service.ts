/*import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IPayload } from 'src/core/interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByEmail(email: string): Promise<any> {
    return this.usersService.findByEmail(email);
  }

  async login(email: string, password: string) {
    const user = await this.validateUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null; // Utilisateur non trouvé ou mot de passe incorrect
    }
    const payload = { email: user.email, sub: user._id }; // Utilisez _id comme sous-objet dans le payload JWT
    return {
      token: this.jwtService.sign(payload), // Générez le jeton JWT
      role: user.role // Incluez le rôle de l'utilisateur si nécessaire
    };
  }

  
  async getToken(payload: IPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
*/