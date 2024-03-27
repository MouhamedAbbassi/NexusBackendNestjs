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
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto';
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
 // Marquer l'utilisateur comme actif lors de la connexion
 user.active = true;
 await user.save();
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
        user: 'raouiadaghnouj66@gmail.com', 
        pass: 'ztso ktks znis uhds', 
      },
    });
  

    // Définir le contenu de l'e-mail
    const mailOptions = {
      from: 'raouiadaghnouj66@gmail.com', 
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
async getUserFromToken(token: string): Promise<any> {
  try {
    const decodedToken = this.jwtService.verify(token);
    const userId = decodedToken.id; // Assurez-vous que vous extrayez correctement l'ID de l'utilisateur du token
    const user = await this.usersModel.findById(userId).exec(); // Assurez-vous de récupérer l'utilisateur depuis la base de données

    if (!user || !user.active) {
      throw new UnauthorizedException('Utilisateur non actif ou introuvable');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException('Token invalide');
  }}


  async updateUser(userId: string, updateUserDto: UpdateUserDto, requestingUserRole: string): Promise<{ message: string }> {
    // Vérifiez si l'utilisateur demandant la mise à jour est un administrateur
    if (requestingUserRole !== 'admin') {
      throw new UnauthorizedException('You are not authorized to perform this action.');
    }

    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Mettez à jour les propriétés de l'utilisateur
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.phoneNumber = updateUserDto.phoneNumber || user.phoneNumber;
    user.role = updateUserDto.role || user.role;

    await user.save();

    return { message: 'User updated successfully' };
  }


  async deleteUser(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersModel.findByIdAndDelete(userId).exec();
  }

  private async findUserById(userId: string): Promise<Users | null> {
    try {
      const user = await this.usersModel.findById(userId).exec();
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }



async addUser(signUpDto: SignUpDto, requestingUserRole: string): Promise<{ message: string }> {
  // Vérifiez si l'utilisateur demandant l'ajout est un administrateur
  if (requestingUserRole !== 'admin') {
    throw new UnauthorizedException('You are not authorized to perform this action.');
  }

  const { name, email, password, phoneNumber, role } = signUpDto;

  // Hash le mot de passe avant de le stocker
  const hashedPassword = await bcrypt.hash(password, 10);

  await this.usersModel.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    role,
  });

  return { message: 'User added successfully' };
}
async getCurrentUsers(): Promise<Users[]> {
  return this.usersModel.find({ active: true }).exec();
}


async updateUserActivity(token: string, activeStatus: boolean): Promise<Users> {
  try {
    const userId = this.extractUserIdFromToken(token);
    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { active: activeStatus },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  } catch (error) {
    console.error('updateUserActivity error:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

extractUserIdFromToken(token: string): string {
  try {
    const decodedToken = this.jwtService.decode(token) as { userId: string };
    if (!decodedToken || !decodedToken.userId) {
      throw new NotFoundException('Invalid token');
    }
    return decodedToken.userId;
  } catch (error) {
    console.error('extractUserIdFromToken error:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

 async searchUsersByNameOrEmail(searchTerm: string): Promise<Users[]> {
    // Utilisez une requête MongoDB pour rechercher par nom ou email
    const users = await this.usersModel
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } }, // Recherche insensible à la casse par nom
          { email: { $regex: searchTerm, $options: 'i' } }, // Recherche insensible à la casse par email
        ],
      })
      .exec();
    return users;
  }
}



 