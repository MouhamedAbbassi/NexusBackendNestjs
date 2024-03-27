import { IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  // Modifiez phoneNumber pour être de type number si nécessaire
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Invalid phone number' })
  phoneNumber?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role?: string;
}

