// src/module/liked-jobs/entities/liked-job.entity.ts
import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { Entity, ManyToOne, Unique, JoinColumn } from "typeorm";

@Entity("liked_jobs")
@Unique(["user", "job"]) 
export class LikedJob extends BaseEntity {
  @ManyToOne(() => Auth, (user) => user.likedJobs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Auth;

  @ManyToOne(() => Job, (job) => job.likedBy, { onDelete: "CASCADE" })
  @JoinColumn({ name: "jobId" })
  job: Job;
}