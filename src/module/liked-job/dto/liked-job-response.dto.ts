// src/module/liked-jobs/dto/liked-job-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class LikedJobResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  jobId: number;

  @ApiProperty()
  jobTitle: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyId: number;

  @ApiProperty()
  cityName: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  employmentType: string;

  @ApiProperty()
  salary: number;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty()
  likedAt: Date;
}