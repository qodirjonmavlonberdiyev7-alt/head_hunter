import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  IsNotEmpty,
  Length,
  Max,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EnumEmploymentType } from "src/shared/constants/job-types";
import { EnumJobLevel } from "src/shared/constants/job-level";
import { EnumCity } from "src/shared/constants/city";
import { EnumCompanies } from "src/shared/constants/companies";
import { EnumSkills } from "src/shared/constants/skills";

export class CreateJobDto {
  @ApiProperty({ example: "Backend Developer (NestJS)" })
  @IsString({ message: "Job title matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Job title bo'sh bo'lishi mumkin emas" })
  @Length(3, 100, {
    message: "Job title 3 dan 100 ta belgigacha bo'lishi kerak",
  })
  title: string;

  @ApiProperty({ enum: EnumJobLevel, example: EnumJobLevel.MIDDLE })
  @IsEnum(EnumJobLevel, {
    message: "Job level EnumJobLevel ichidagi qiymatlardan biri bo'lishi kerak",
  })
  level: EnumJobLevel;

  @ApiProperty({ example: "Node.js va PostgreSQL bilan ishlash tajribasi..." })
  @IsString({ message: "Description matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Description bo'sh bo'lishi mumkin emas" })
  @Length(20, 2000, {
    message: "Description 20 dan 2000 belgigacha bo'lishi kerak",
  })
  description: string;

  @ApiProperty({ example: 1500, required: false })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: "Salary son bo'lishi kerak",
    },
  )
  @Min(0, {
    message: "Salary 0 dan kichik bo'lishi mumkin emas",
  })
  @Max(1000000, {
    message: "Salary juda katta qiymat bo'lishi mumkin emas",
  })
  salary?: number;

  @ApiProperty({
    enum: EnumEmploymentType,
    example: EnumEmploymentType.FULL_TIME,
  })
  @IsEnum(EnumEmploymentType, {
    message:
      "Employment type EnumEmploymentType ichidagi qiymatlardan biri bo'lishi kerak",
  })
  employmentType: EnumEmploymentType;

  // RELATIONLAR UCHUN IDLAR
  @ApiProperty({
    enum: EnumCity,
    example: EnumCity.Tashkent,
    description: "Shahar nomi (EnumCity dan)",
  })
  @IsEnum(EnumCity, {
    message: "Shahar nomi EnumCity ichidagi qiymatlardan biri bo'lishi kerak",
  })
  @IsNotEmpty()
  cityName: EnumCity;

  @ApiProperty({
    enum: EnumCompanies,
    example: EnumCompanies.PAYME,
    description: "Kompaniya nomi (EnumCompanies dan)",
  })
  @IsEnum(EnumCompanies, {
    message:
      "Kompaniya nomi EnumCompanies ichidagi qiymatlardan biri bo'lishi kerak",
  })
  @IsNotEmpty()
  companyName: EnumCompanies;

  @ApiProperty({
    enum: EnumSkills,
    isArray: true,
    example: [EnumSkills.NestJS, EnumSkills.PostgreSQL, EnumSkills.React],
    description: "Ko'nikmalar ro'yxati (EnumSkills dan)",
  })
  @IsArray()
  @IsEnum(EnumSkills, {
    each: true,
    message:
      "Har bir skill EnumSkills ichidagi qiymatlardan biri bo'lishi kerak",
  })
  skillNames: EnumSkills[];
}
