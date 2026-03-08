import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { EnumSkills } from "src/shared/constants/skills";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({name: "skills"})
export class Skill extends BaseEntity{
    @Column({type: 'enum', enum: EnumSkills})
    name: EnumSkills

    //relations

    @ManyToMany(() => Job, (job) => job.skills)
    jobs: Job[];
}
