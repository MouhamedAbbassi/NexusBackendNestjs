import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsIn } from "class-validator";

export class SignUpDto {
    
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter a valid email" })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Please enter a valid phone number starting with '+'" })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['admin', 'user'], { message: "Role must be either 'admin' or 'user'" }) // Validation du rôle
    readonly role: string; // Champ de rôle

}
