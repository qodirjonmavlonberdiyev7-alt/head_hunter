import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { EnumEmploymentType } from "src/shared/constants/job-types";
import { BaseEntity } from "src/database/base.entity";
import { EnumJobLevel } from "src/shared/constants/job-level";
import { City } from "src/module/cities/entities/city.entity";
import { Company } from "src/module/companies/entities/company.entity";
import { Skill } from "src/module/skills/entities/skill.entity";

@Entity("jobs")
export class Job extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    type: "enum",
    enum: EnumJobLevel,
    default: EnumJobLevel.JUNIOR, // Standart holatda Junior
  })
  level: EnumJobLevel;

  @Column({
    type: "enum",
    enum: EnumEmploymentType,
    default: EnumEmploymentType.FULL_TIME,
  })
  employmentType: EnumEmploymentType;

  @Column({ type: "decimal", nullable: true })
  salary: number;

  @Column({ default: true })
  isActive: boolean;

  //relations

  @ManyToOne(() => City, (city) => city.jobs, { onDelete: "CASCADE" })
  city: City;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: "CASCADE" })
  company: Company;

  @ManyToMany(() => Skill)
  @JoinTable({ name: "job_skills" }) // Oraliq jadval nomi
  skills: Skill[];
}
