import { BaseEntity } from "src/database/base.entity";
import { EnumSkills } from "src/shared/constants/skills";
import { Column, Entity } from "typeorm";

@Entity({name: "skills"})
export class Skill extends BaseEntity{
    @Column()
    name: EnumSkills
}
