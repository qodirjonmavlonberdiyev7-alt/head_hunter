import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl } from "class-validator";
import { EnumCompanies } from "src/shared/constants/companies";

export class CreateCompanyDto {
  @ApiProperty({ enum: EnumCompanies })
  @IsString()
  @IsEnum(EnumCompanies)
  name: EnumCompanies;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}