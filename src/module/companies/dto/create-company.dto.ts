import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, Length, Matches } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ example: "Payme" })
  @IsString({ message: "Kompaniya nomi matn bo'lishi kerak" })
  @Length(2, 100, { message: "Kompaniya nomi 2 dan 100 ta belgigacha bo'lishi kerak" })
  name: string;

  @ApiProperty({ default: "O'zbekistondagi yetakchi to'lov tizimi" })
  @IsOptional()
  @IsString({ message: "Description matn bo'lishi kerak" })
  @Length(10, 300, { message: "Description 10 dan 300 ta belgigacha bo'lishi kerak" })
  description?: string;

  @ApiProperty({ default: "https://payme.uz" })
  @IsOptional()
  @IsUrl({}, { message: "Website to'g'ri URL formatida bo'lishi kerak" })
  website?: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString({ message: "Telefon raqam matn ko'rinishida bo'lishi kerak" })
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998901234567 formatida bo'lishi kerak" })
  phoneNumber: string;
}
