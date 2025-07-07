import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    full_name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
