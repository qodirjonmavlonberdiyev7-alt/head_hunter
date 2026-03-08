import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { City } from '../cities/entities/city.entity';
import { Company } from '../companies/entities/company.entity';
import { Skill } from '../skills/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job,City, Company, Skill])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
