import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { EnumSkills } from "src/shared/constants/skills";

export class CreateSkillDto {
    @ApiProperty({default: EnumSkills.NestJS})
    @IsString()
    name: string;
}
