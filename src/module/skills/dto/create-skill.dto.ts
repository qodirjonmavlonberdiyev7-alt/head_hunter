import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateSkillDto {
  @ApiProperty({ example: "TypeScript", description: "Ko'nikma yoki texnologiya nomi" })
  @IsString({ message: "Skill nomi matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Skill nomi bo'sh bo'lishi mumkin emas" })
  @Length(1, 50, { message: "Skill nomi 1 dan 50 belgigacha bo'lishi kerak" })
  name: string;
}
