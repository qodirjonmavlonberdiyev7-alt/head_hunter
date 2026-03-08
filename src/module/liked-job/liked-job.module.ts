// src/module/liked-jobs/liked-jobs.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikedJob } from "./entities/liked-job.entity";
import { Auth } from "../auth/entities/auth.entity";
import { Job } from "../jobs/entities/job.entity";
import { LikedJobsController } from "./liked-job.controller";
import { LikedJobsService } from "./liked-job.service";

@Module({
  imports: [TypeOrmModule.forFeature([LikedJob, Auth, Job])],
  controllers: [LikedJobsController],
  providers: [LikedJobsService],
  exports: [LikedJobsService],
})
export class LikedJobsModule {}