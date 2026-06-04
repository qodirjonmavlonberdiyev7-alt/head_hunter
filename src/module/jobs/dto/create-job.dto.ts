import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Length,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EnumEmploymentType } from "src/shared/constants/job-types";
import { EnumJobLevel } from "src/shared/constants/job-level";

export class CreateJobDto {
  @ApiProperty({ example: "Backend Developer (NestJS)" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({ enum: EnumJobLevel, example: EnumJobLevel.MIDDLE })
  @IsEnum(EnumJobLevel)
  level: EnumJobLevel;

  @ApiProperty({ example: "Node.js va PostgreSQL bilan ishlash tajribasi..." })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  description: string;

  @ApiProperty({ example: "5 000 000 so'm yoki 500-1000 USD", required: false })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiProperty({ enum: EnumEmploymentType, example: EnumEmploymentType.FULL_TIME })
  @IsEnum(EnumEmploymentType)
  employmentType: EnumEmploymentType;

  @ApiProperty({ example: "Tashkent", description: "Shahar nomi" })
  @IsOptional()
  @IsString()
  cityName?: string;

  @ApiProperty({ example: "Payme", description: "Kompaniya nomi" })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: ["NestJS", "PostgreSQL", "React"],
    description: "Ko'nikmalar ro'yxati",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillNames?: string[];
}
