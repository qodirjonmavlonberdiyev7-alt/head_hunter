import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create-job.dto";
import { IsEnum, IsOptional } from "class-validator";
import { EnumJobLevel } from "src/shared/constants/job-level";

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(EnumJobLevel)
  level?: EnumJobLevel;
}
