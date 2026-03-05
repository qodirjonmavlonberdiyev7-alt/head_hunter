import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyAuthDto {
    @ApiProperty({default: "qodirjonmavlonberdiyev7@gmail.com"})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({default: "597643"})
    @IsString()
    otp: string; 
}