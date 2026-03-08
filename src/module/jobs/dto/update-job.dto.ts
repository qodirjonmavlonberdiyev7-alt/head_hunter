import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create-job.dto";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { EnumJobLevel } from "src/shared/constants/job-level";
import { EnumCity } from "src/shared/constants/city";
import { EnumCompanies } from "src/shared/constants/companies";
import { EnumSkills } from "src/shared/constants/skills";

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(EnumJobLevel)
  level?: EnumJobLevel;

  @IsOptional()
  @IsEnum(EnumCity)
  cityName?: EnumCity;

  @IsOptional()
  @IsEnum(EnumCompanies)
  companyName?: EnumCompanies;

  @IsOptional()
  @IsArray()
  @IsEnum(EnumSkills, { each: true })
  skillNames?: EnumSkills[];
}
