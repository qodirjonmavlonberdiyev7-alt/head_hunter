// src/module/application/dto/create-application.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { ApplicationStatus } from "src/shared/constants/application-status"; // SHARED DAN IMPORT

// DTO da enum ni eksport qilmang!
export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: "Vakansiya ID si" })
  @IsNumber()
  @IsNotEmpty()
  jobId: number;

  @ApiProperty({ 
    example: "Assalomu alaykum, men ushbu vakansiyaga qiziqish bildirdim...", 
    required: false 
  })
  @IsOptional()
  @IsString()
  @Length(20, 1000, { message: "Murojaat xati 20 dan 1000 belgigacha bo'lishi kerak" })
  coverLetter?: string;

  @ApiProperty({ 
    example: "https://my-storage.com/cv/my-resume.pdf", 
    description: "CV fayl manzili (URL)" 
  })
  @IsUrl({}, { message: "CV manzili to'g'ri URL bo'lishi kerak" })
  @IsNotEmpty()
  cvUrl: string;
}