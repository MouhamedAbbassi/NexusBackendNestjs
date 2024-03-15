// users.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from './schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { EmailVerification, EmailVerificationDocument } from './schemas/email-verification.schema'; 
import * as nodemailer from 'nodemailer';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @InjectModel(EmailVerification.name) private readonly emailVerificationModel: Model<EmailVerificationDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,

  ) {}
 

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }
 async findByEmail(email: string): Promise<Users | null> {
    return this.usersModel.findOne({ email }).exec();
  }
 /* async findByEmail(email: string): Promise<Users | null> {
    try {
      // Recherche insensible à la casse
      const user = await this.usersModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      return user;
    } catch (error) {
      // Gestion des erreurs
      console.error("Error while finding user by email:", error);
      return null;
    }}*/

  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, phoneNumber, role } = signUpDto;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    const token = this.jwtService.sign({ id: user._id, role });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; role: string }> {
    const { email, password } = loginDto;
    const user = await this.usersModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return { token, role: user.role };
  }

async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; resetToken: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await user.save();

    // Send email with reset link using the resetToken

    return { message: 'Password reset process triggered successfully', resetToken };
  }

 
  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Générer un OTP à 6 chiffres
    user.resetToken = otp;
    user.resetTokenExpiration = new Date(Date.now() + 600000); // Expiration de l'OTP dans 10 minutes
    await user.save();

    // Configurer le service de messagerie SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'raouiadaghnouj66@gmail.com', // Votre adresse e-mail Gmail
        pass: 'ztso ktks znis uhds', // Votre mot de passe Gmail
      },
    });
  

    // Définir le contenu de l'e-mail
    const mailOptions = {
      from: 'raouiadaghnouj66@gmail.com', // Votre adresse e-mail Gmail
      to: email,
      subject: 'Réinitialisation de mot de passe',
      text: `Votre code de réinitialisation de mot de passe est : ${otp}`,
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

 /* async verifyOTP(userId: string, otp: string): Promise<void> {
    const user = await this.usersModel.findById(userId);
    if (!user || user.resetToken !== otp || user.resetTokenExpiration < new Date()) {
      throw new BadRequestException('OTP invalide ou expiré');
    }
    // Réinitialiser le jeton et l'expiration de l'OTP
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
 */
  async verifyOTPByEmail(email: string, otp: string,userId:string): Promise<void> {
    const user = await this.usersModel.findOne({ email });

    if (!user || user.resetToken !== otp || user.resetTokenExpiration < new Date()) {
      throw new BadRequestException('OTP invalide ou expiré');
    }

    // Réinitialiser le jeton et l'expiration de l'OTP
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, newPassword } = resetPasswordDto;
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  /*getCurrentUser(token: string): Promise<Users | undefined> {
    const decoded = this.jwtService.decode(token);
    if (decoded) {
        return this.usersModel.findOne({ name: decoded['name'] }).exec();
    } else {
        return Promise.resolve(undefined);
    }
}

async getUserProfile(userId: string): Promise<UsersDocument> {
  return await this.usersModel.findById(userId).exec();
}*/
async getUserFromToken(token: string) {
  try {
    const decoded = this.jwtService.verify(token);
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
} 

}
  
  /* async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.usersModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return { message: 'Password reset successfully' };
  }
*/

  /*async sendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    const verification = await this.emailVerificationModel.create({ email, token, expiresAt: new Date(Date.now() + 3600000) });
    // Send email with verification link using the token
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersModel.findOne({ resetToken: token });
    if (!user || user.resetTokenExpiration < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
  
    // Mettre à jour le statut de vérification de l'email
    user.emailVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }
  

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.usersModel.findByIdAndUpdate(userId, { emailVerified: true });
  }
  
  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour
    await user.save();
    // Send email with reset link using the resetToken
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    return { message: 'Password reset successfully' };
  }
  */

