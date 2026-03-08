// src/module/liked-jobs/dto/create-liked-job.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikedJobDto {
  @ApiProperty({ example: 1, description: "Vakansiya ID si" })
  @IsNumber()
  @IsNotEmpty()
  jobId: number;
}