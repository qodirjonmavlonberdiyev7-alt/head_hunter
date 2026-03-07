import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({default: "Qodirjon"})
    @IsString({message: "string bo'lishi kerak"})
    @Length(3,50)
    username: string;

    @ApiProperty({default: "qodirjonmavlonberdiyev7@gmail.com"})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({default: "09122005"})
    @IsString()
    password: string;
}

export class LoginAuthDto {
    @ApiProperty({default: "qodirjonmavlonberdiyev7@gmail.com"})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({default: "09122005"})
    @IsString()
    password: string; 
}
