// logout-user.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
