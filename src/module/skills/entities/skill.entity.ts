import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({ name: "skills" })
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];
}
