import { Body, Controller, Post, UseGuards ,Get, Req, Res, Request, BadRequestException, Param, Query, HttpException, HttpStatus, Put, Delete, ForbiddenException, UseInterceptors, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { Users } from './schemas/users.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Response } from 'express'; 
import { JwtStrategy } from 'src/auth';
import { AuthGuard } from '@nestjs/passport';
import { LogoutUserDto } from './dto/logout.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
      private  readonly jwtService: JwtService) {}

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
  
   /* @Post('/verify-otp/:userId')
  async verifyOTP(@Param('userId') userId: string, @Body('otp') otp: string): Promise<{ message: string }> {
    try {
      await this.usersService.verifyOTP(userId, otp);
      return { message: 'OTP vérifié avec succès.' };
    } catch (error) {
      throw new BadRequestException(error.message); // Renvoyer une erreur 400 avec le message d'erreur
    }
  }
*/
@Post('/verify-otp')
  async verifyOTP(@Body('email') email: string, @Body('otp') otp: string, @Body('userId') userId: string): Promise<{ message: string }> {
    try {
      await this.usersService.verifyOTPByEmail(email, otp, userId);
      return { message: 'OTP vérifié avec succès.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  
}
@Put('/reset-password')
async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
  try {
    return await this.usersService.resetPassword(resetPasswordDto);
  } catch (error) {
    throw new BadRequestException('Une erreur est survenue lors de la réinitialisation du mot de passe');
  }
}



  /*  @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getCurrentUser(@Request() req) {
        // Utilisez l'ID de l'utilisateur extrait du token JWT pour récupérer ses détails depuis la base de données
        const userId = req.users.id;
        const users = await this.usersService.getUserProfile(userId);
        // Assurez-vous de masquer les informations sensibles si nécessaire
        return users;
    }*/

    @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userData = await this.usersService.getUserFromToken(req.headers.authorization.split(' ')[1]);
    // userData contient les informations de l'utilisateur extraites du token JWT
    return userData;
  }

  @Get()
  async getUsers(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard) // Utilisez le JwtAuthGuard pour cette route
  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    // Passez le rôle "admin" en tant que troisième argument
    return this.usersService.updateUser(userId, updateUserDto, 'admin');
  }

@UseGuards(JwtAuthGuard)
@Delete('/delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
    try {
      const { userId } = deleteUserDto;
      await this.usersService.deleteUser(userId); // Assurez-vous que userId est une chaîne (string)
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }





  

@UseGuards(JwtAuthGuard) // Utilisez le JwtAuthGuard pour cette route
@Post('add')
async addUser(@Body() signUpDto: SignUpDto) {
  return this.usersService.addUser(signUpDto, 'admin'); // Passez le rôle "admin"
}


@Get('active/all')
  async getAllUsersCurrent(): Promise<Users[]> {
    return this.usersService.getCurrentUsers();
  }

 
  @Post('logout')
async logoutUser(@Body() logoutUserDto: LogoutUserDto): Promise<any> {
  try {
    const updatedUser = await this.usersService.updateUserActivity(logoutUserDto.token, false);
    return { message: 'User logged out successfully', user: updatedUser };
  } catch (error) {
    console.error('logoutUser error:', error);
    if (error instanceof NotFoundException) {
      return { message: 'User not found' };
    }
    throw error; // Rethrow the error to be caught by the caller
  }
  }
 
@Get('/search')
  async searchUsers(@Query('searchTerm') searchTerm: string): Promise<Users[]> {
    return this.usersService.searchUsersByNameOrEmail(searchTerm);
  }

}

  
