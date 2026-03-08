// src/module/application/dto/application-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "src/shared/constants/application-status"; // SHARED DAN IMPORT

export class ApplicationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  jobId: number;

  @ApiProperty()
  jobTitle: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ required: false })
  coverLetter?: string;

  @ApiProperty({ required: false })
  cvUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}