// delete-user.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: string ;
}
