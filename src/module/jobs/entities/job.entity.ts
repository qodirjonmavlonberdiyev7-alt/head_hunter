import { Entity, Column } from "typeorm";
import { EnumEmploymentType } from "src/shared/constants/job-types";
import { BaseEntity } from "src/database/base.entity";
import { EnumJobLevel } from "src/shared/constants/job-level";

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
}
