import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty} from "class-validator";
import { EnumSkills } from "src/shared/constants/skills";

export class CreateSkillDto {
  @ApiProperty({
    example: "NestJS",
    enum: EnumSkills,
    description:
      "Texnologiya yoki ko'nikma nomi (Enum qiymatlaridan biri bo'lishi shart)",
  })
  @IsNotEmpty({ message: "Skill nomi bo'sh bo'lishi mumkin emas" })
  @IsEnum(EnumSkills, {
    message:
      "Noto'g'ri skill nomi. Faqat belgilangan ro'yxatdagilarni kiriting.",
  })
  name: EnumSkills;
}
