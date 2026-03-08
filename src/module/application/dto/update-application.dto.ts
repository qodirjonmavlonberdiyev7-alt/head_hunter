// src/module/application/dto/update-application.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { CreateApplicationDto } from "./create-application.dto";
import { ApplicationStatus } from "src/shared/constants/application-status"; // SHARED DAN IMPORT

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({ 
    enum: ApplicationStatus, 
    example: ApplicationStatus.REVIEWING, 
    required: false 
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}