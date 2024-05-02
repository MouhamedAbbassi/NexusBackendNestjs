// update-profile.dto.ts
import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UserProfile {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;


}

export class UpdateUserProfileDto {

user ?:UserProfile
token:string

}