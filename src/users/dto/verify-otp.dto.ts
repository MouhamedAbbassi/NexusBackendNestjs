// verify-otp.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
