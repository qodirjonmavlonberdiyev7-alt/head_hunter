import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'city' })
export class City extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  region: string;

  @OneToMany(() => Job, (job) => job.city)
  jobs: Job[];
}
