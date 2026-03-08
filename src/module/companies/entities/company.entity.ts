import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { EnumCompanies } from "src/shared/constants/companies";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Company extends BaseEntity {
  @Column({ type: 'enum', enum: EnumCompanies })
  name: EnumCompanies;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({nullable: true})
  phoneNumber: string;

  //relations

  @OneToMany(() => Job, (job) => job.company)
    jobs: Job[];
}