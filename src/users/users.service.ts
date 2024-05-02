// users.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Users, UsersDocument } from './schemas/users.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { EmailVerification, EmailVerificationDocument } from './schemas/email-verification.schema'; 
import * as nodemailer from 'nodemailer';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { Twilio } from 'twilio';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { UserProfile } from './dto/updateProfile.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    @InjectModel(EmailVerification.name) private readonly emailVerificationModel: Model<EmailVerificationDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,

  ) { const uploadDir = path.resolve(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }}

  async verifyOTPSMS(email:string,phoneNumber: string, otp: string): Promise<boolean> {

  
    const user = await this.usersModel.findOne({ phoneNumber,email });
    console.log(user)
    if (!user) {
      throw new Error('User not found');
    }
    return user.otp === otp; 
  }
 

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

    formatPhoneNumber(phoneNumber: string): string {
      const trimmedPhoneNumber = phoneNumber.trim();
      const countryCode = '+216';
      const formattedPhoneNumber = trimmedPhoneNumber.startsWith(countryCode)
        ? trimmedPhoneNumber
        : countryCode + trimmedPhoneNumber;
    
      // Ajoutez un console.log() pour afficher le numéro de téléphone formaté
      console.log('Numéro de téléphone formaté :', formattedPhoneNumber);
    
      return formattedPhoneNumber;
    }
    
    async sendVerificationCode(phoneNumber: string, verificationCode: string): Promise<void> {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
      // Utilisez Twilio pour envoyer le message SMS avec le code de vérification
     
      const twilioClient = new Twilio(accountSid, authToken);
       await twilioClient.messages.create({
         body: `Your verification code is: ${verificationCode}`,
        from: '+12563684737',
       to: '+21694500649',
      });
    }
  
    async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
      const { name, email, password, phoneNumber, role } = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersModel.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
      });
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = verificationCode
      await user.save()
      await this.sendVerificationCode(phoneNumber, verificationCode);
      const token = this.jwtService.sign({ id: user._id, role });
      return { token };
    }
  
    // Autres méthodes de votre service...
  

  async login(loginDto: LoginDto): Promise<{ token: string; role: string }> {
    const { email, password } = loginDto;
    console.log('ggg',loginDto)
    const user = await this.usersModel.findOne({ email });
console.log('fff',user)
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
    console.log(newPassword,email)
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword)
    user.password = hashedPassword;
    await user.save();
    return { message: 'Mot de passe réinitialisé avec succès' };
  }

async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
    
      console.log('Current password:', currentPassword);
      console.log('New password:', newPassword);

      const userId = this.extractUserIdFromToken(token);
      const user = await this.usersModel.findById(userId);
      console.log(user)
      if (!user) {

        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new Error('Incorrect current password');
      }

      // Validate new password
      if (
        newPassword.length < 6 ||
        !/\d/.test(newPassword) ||
        !/[A-Z]/.test(newPassword)
      ) {
        throw new Error(
          'New password must be at least 6 characters long and include at least one digit and one uppercase letter.',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Sending an email notification to the user about password change
      await this.sendEmail({
        recipient: [{ email: user.email }],
        subject: 'Password Change Notification',
        body: {
          message:
            'Your password has been successfully changed. If you did not make this change, please contact our support team immediately.',
        },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
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
async getUserFromToken(token: string): Promise<Users> {
  try {
    const decodedToken = this.jwtService.verify(token);
    console.log(decodedToken)
    const userId = decodedToken.id;
    const user = await this.usersModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException('Token invalide');
  }
}
async updateProfile(
  token: string,
  userProfile: UserProfile,
): Promise<Users> {
  const userId = this.extractUserIdFromToken(token);
  const user = await this.usersModel.findByIdAndUpdate(
    userId,
    userProfile,
    { new: true },
  );
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
async sendEmail(emailData: { recipient: any; subject: any; body: any }) {
  const { recipient, subject, body } = emailData;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'raouiadaghnouj66@gmail.com',
      pass: 'dtlf qfgt eqes lxik', // App password or environment variable recommended
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  const emailBody = `
      <p>Hello,</p>
      <p>You have requested to reset your password. If you did not request this, please ignore this email.</p>
      <p>If you did make this request, please click on the link below to reset your password:</p>
      <a href="${body.link}">Reset Password</a>
      <p>Thank you!</p>
  `;

  // Send email
  try {
    await transporter.sendMail({
      from: '', // Sender address
      to: recipient.map((r: { email: any }) => r.email).join(','), // list of receivers
      subject: subject, // Subject line
      html: emailBody, // html body
    });

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to ensure it's handled further up the call stack
  }
}

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
  catch (error) {
    throw new InternalServerErrorException(
      'An error occurred while updating the user profile',
    );
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

async getNotActiveUser(): Promise<Users[]> {
  return this.usersModel.find({ active: false }).exec();
}


async updateUserPhoto(
  file: Express.Multer.File,
  userId: string,
): Promise<string> {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }
  const imageUrl = await this.getImageUploadUrl(file); // URL of the saved image
  const user = await this.usersModel.updateOne(
    { _id: userId },
    {
      image: imageUrl,
    },
    {
      upsert: false,
    },
  );

  if (!user) {
    throw new NotFoundException('User not found');
  }
  return imageUrl;
}

//upload image
async getImageUploadUrl(file: Express.Multer.File): Promise<string> {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }
  const { originalname } = file;
  const fileName = `${Date.now()}-${originalname}`;
  const imageUrl = `http://localhost:3000/uploads/${fileName}`; // URL of the saved image
  return imageUrl;
}

async saveImage(file: Express.Multer.File): Promise<string> {
  const imagePath = `uploads/${file.originalname}`;
  await fs.writeFile(imagePath, file.buffer);
  return imagePath;
}
async updateUserActivity(token: string, activeStatus: boolean): Promise<Users> {
  console.log('Token received:', token);
  try {
    const userId = this.extractUserIdFromToken(token);
    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { active: activeStatus,lastLogin: new Date(Date.now()) },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  } catch (error) {
    console.error('updateUserActivity error:', error);
    throw error; 
  }
}

/*async updateUserActivity(token: string): Promise<Users> {
  console.log('Token received:', token);
  try {
    const userId = this.extractUserIdFromToken(token);
    const activeStatus: boolean = false;
    const logoutDate = new Date();

    const user = await this.usersModel.findByIdAndUpdate(
      userId,
      { active: activeStatus, logoutDate: logoutDate },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  } catch (error) {
    this.logger.error('Error updating user activity', error.message);
    console.error('updateUserActivity error:', error.message);
    throw new InternalServerErrorException(
      `Error updating user activity ${error.message}`,
    );
  }
}*/
  extractUserIdFromToken (token: string): string {
    console.log('token:', token);
    try {
      const decodedToken = this.jwtService.verify(token) ;
      console.log(decodedToken); 
      if (!decodedToken || !decodedToken.id) {
        throw new NotFoundException('Invalid token');
      }
     // console.log('Decoded token:', decodedToken); 
      return decodedToken.id;
    } catch (error) {
      console.error('extractUserIdFromToken error:', error);
      throw error; 
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

  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('File received:', file);
  
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
  
    const { originalname } = file;
    const fileName = `${Date.now()}-${originalname}`;
    const uploadPath = path.resolve(__dirname, '..', 'uploads', fileName);
  
    // Créer une promesse pour gérer le processus d'écriture du fichier
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(uploadPath);
  
      writeStream.on('error', (err) => {
        console.error('Error writing file:', err);
        reject(err); // Rejeter la promesse en cas d'erreur
      });
  
      writeStream.on('finish', () => {
        console.log('File saved:', fileName);
        const imageUrl = `http://localhost:3000/uploads/${fileName}`; // URL de l'image sauvegardée
        resolve(imageUrl); // Résoudre la promesse avec l'URL de l'image
      });
  
      writeStream.end(file.buffer); // Écrire les données du fichier dans le flux d'écriture
    });

  }


async findUserByGitHubProfileId(id:string){
  return await this.usersModel.findOne({gitHubProfileId : id})
}

async findUserByGoogleProfileId(id:string){
  return await this.usersModel.findOne({googleProfileId: id})
}

async createUser(userDTO:any){
  return await this.usersModel.create(userDTO);
}



}



 