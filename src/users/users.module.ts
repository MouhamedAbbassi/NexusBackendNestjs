/*import { Module } from '@nestjs/common';
//import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
//import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailVerification, EmailVerificationSchema } from './schemas/email-verification.schema'; // Importez le schéma EmailVerification

@Module({
  imports: [


    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),


    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema }, // Enregistrez le schéma EmailVerification
    ]),
    ConfigModule, // Importez ConfigModule ici s'il n'est pas déjà importé dans votre AppModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Assurez-vous que ConfigModule est importé
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_ACCESS_EXP'),
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],  
  exports: [UsersService], // Exportez UsersService pour une utilisation dans d'autres modules
})
export class UsersModule {}
*/