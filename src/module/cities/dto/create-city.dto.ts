import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateCityDto {
  @ApiProperty({ example: "Namangan", description: "Shahar nomi" })
  @IsString({ message: "Shahar nomi matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Shahar nomi bo'sh bo'lishi mumkin emas" })
  @Length(2, 50, { message: "Shahar nomi 2 dan 50 belgigacha bo'lishi kerak" })
  name: string;

  @ApiProperty({ example: "Toshkent viloyati", description: "Viloyat nomi" })
  @IsString({ message: "Region matn ko'rinishida bo'lishi kerak" })
  @IsNotEmpty({ message: "Region bo'sh bo'lishi mumkin emas" })
  @Length(3, 50, { message: "Viloyat nomi 3 dan 50 belgigacha bo'lishi kerak" })
  region: string;
}
