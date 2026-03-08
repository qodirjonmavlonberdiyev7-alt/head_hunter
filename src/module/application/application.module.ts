// src/module/application/application.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationController } from "./application.controller";
import { ApplicationService } from "./application.service";
import { Application } from "./entities/application.entity";
import { Auth } from "../auth/entities/auth.entity";
import { Job } from "../jobs/entities/job.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Application, Auth, Job])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}