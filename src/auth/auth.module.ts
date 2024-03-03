import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './github.strategy';
//import { GoogleStrategy } from './google.strategy';
import { ENV } from 'src/core/config';
const strategies = [JwtStrategy, GithubStrategy]; //GoogleStrategy
@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: ENV.JWT_ACCESS_EXP },
    }),
  ],
  providers: [AuthService, ...strategies],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
