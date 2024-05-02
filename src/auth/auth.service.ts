import { Injectable } from '@nestjs/common';
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


  async loginWithGitHub (userDTO:any){
    let user = await this.usersService.findUserByGitHubProfileId(userDTO.gitHubProfileId)
    console.log(userDTO)
    if (!user ){
      user = await this.usersService.createUser(userDTO);
    }
    const payload = { gitHubProfileId: user.gitHubProfileId, id: user._id ,role:user.role}; // Utilisez _id comme sous-objet dans le payload JWT
    const token = this.jwtService.sign(payload)
    await this.usersService.updateUserActivity(token,true)
    return {
      token ,// Générez le jeton JWT
      role: user.role // Incluez le rôle de l'utilisateur si nécessaire
    };
  }


  async loginWithGoogle (userDTO:any){
    let user = await this.usersService.findUserByGoogleProfileId(userDTO.googleProfileId)
    console.log(user)
    if (!user ){
      user = await this.usersService.createUser(userDTO);
    }
    const payload = { googleProfileId: user.googleProfileId, id: user._id ,role:user.role}; // Utilisez _id comme sous-objet dans le payload JWT
    const token = this.jwtService.sign(payload)
    await this.usersService.updateUserActivity(token,true)
    return {
      token ,// Générez le jeton JWT
      role: user.role // Incluez le rôle de l'utilisateur si nécessaire

    };
  }
}
