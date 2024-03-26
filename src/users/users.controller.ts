/*import { Body, Controller, Post, UseGuards ,Get, Req, Res, Request, BadRequestException, Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{token: string}> {
        return this.usersService.signup(signUpDto);
    }
    
   

   
        @Post('/login') 
        async login(@Body() loginDto: LoginDto): Promise<{ token: string, role: string }> {
            return this.usersService.login(loginDto);

        }

        @Post('/forgot-password')
        async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; resetToken: string }> {
          return this.usersService.forgotPassword(forgotPasswordDto);
        }
      


    @Post('/password-recovery')
    async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto): Promise<{ message: string }> {
      try {
        await this.usersService.sendPasswordRecoveryEmail(passwordRecoveryDto.email);
        return { message: 'Email de récupération de mot de passe envoyé avec succès.' };
      } catch (error) {
        throw new BadRequestException('Impossible d\'envoyer l\'email de récupération de mot de passe.');
      }
    }
  
    @Post('/verify-otp/:userId')
    async verifyOTP(@Param('userId') userId: string, @Body('otp') otp: string): Promise<{ message: string }> {
      await this.usersService.verifyOTP(userId, otp);
      return { message: 'OTP vérifié avec succès.' };
    }
  
    @Post('/reset-password-with-otp')
    async resetPasswordWithOTP(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
      return this.usersService.resetPasswordWithOTP(resetPasswordDto);
    }

      

   
}
*/