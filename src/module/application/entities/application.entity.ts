// src/module/application/entities/application.entity.ts
import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { ApplicationStatus } from "src/shared/constants/application-status"; // SHARED DAN IMPORT

@Entity("applications")
@Unique(["user", "job"])
export class Application extends BaseEntity {
  @ManyToOne(() => Auth, (user) => user.applications, { onDelete: "CASCADE" })
  user: Auth;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: "CASCADE" })
  job: Job;

  @Column({ 
    type: "enum", 
    enum: ApplicationStatus, 
    default: ApplicationStatus.PENDING 
  })
  status: ApplicationStatus;

  @Column({ type: "text", nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ nullable: true })
  notes: string;
}