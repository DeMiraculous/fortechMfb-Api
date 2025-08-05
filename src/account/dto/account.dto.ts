import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateaccountDto {
    @IsNotEmpty()
    @IsString()
    account_number!: string;

    @IsOptional()
    @IsNumber()
    balance!: number;

    @IsNotEmpty()
    @IsNumber()
    user_id!: number;
}