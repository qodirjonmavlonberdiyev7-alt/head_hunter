import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './module/auth/entities/auth.entity';
import { AuthModule } from './module/auth/auth.module';
import { City } from './module/cities/entities/city.entity';
import { CitiesModule } from './module/cities/cities.module';
import { SkillsModule } from './module/skills/skills.module';
import { Skill } from './module/skills/entities/skill.entity';
import { Company } from './module/companies/entities/company.entity';
import { CompaniesModule } from './module/companies/companies.module';
import { JobsModule } from './module/jobs/jobs.module';
import { Job } from './module/jobs/entities/job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "postgres",
      port: 5432,
      host: "localhost",
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      entities: [Auth, City, Skill, Company, Job],
      synchronize: true,
      logging: false
    }),
    AuthModule,
    CitiesModule,
    SkillsModule,
    CompaniesModule,
    JobsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
