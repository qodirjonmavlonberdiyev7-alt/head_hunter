import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Company extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
