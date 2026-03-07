import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "./entities/job.entity";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { EnumJobLevel } from "src/shared/constants/job-level";

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepo: Repository<Job>
  ) {}

  async create(createJobDto: CreateJobDto): Promise<{ message: string }> {
    try {
      const { title, level, employmentType } = createJobDto;

      // Level enumini tekshirish (xuddi Skills/Company dagi kabi)
      const enumLevel = (level as unknown) as EnumJobLevel;
      
      if (!Object.values(EnumJobLevel).includes(enumLevel as EnumJobLevel)) {
        throw new BadRequestException("Invalid job level (Junior, Middle, Senior etc.)");
      }

      const job = this.jobRepo.create({
        ...createJobDto,
        level: enumLevel as EnumJobLevel
      });

      await this.jobRepo.save(job);
      return { message: "Job post created successfully" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Job[]> {
    try {
      // Faqat aktiv vakansiyalarni qaytaramiz
      const jobs = await this.jobRepo.find({ 
        where: { isActive: true },
        order: { createdAt: 'DESC' } // Yangilari birinchi tursin
      });

      if (jobs.length === 0) throw new NotFoundException("No active jobs found");
      return jobs;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      const job = await this.jobRepo.findOne({ where: { id } });
      if (!job) throw new NotFoundException("Job not found");
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

 async update(id: number, updateJobDto: UpdateJobDto) {
  try {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException("Job not found");

    // Agar level yangilanayotgan bo'lsa, uni tekshiramiz
    if (updateJobDto.level) {
      // Kelayotgan qiymat enum ichida borligini tekshirish
      const isValidLevel = Object.values(EnumJobLevel).includes(
        updateJobDto.level as unknown as EnumJobLevel
      );

      if (!isValidLevel) {
        throw new BadRequestException("Invalid job level");
      }
      
      // Xatolikni yo'qotish uchun 'unknown' orqali cast qilamiz
      updateJobDto.level = updateJobDto.level as unknown as EnumJobLevel;
    }

    // Bazani yangilash
    await this.jobRepo.update(id, updateJobDto);
    
    return { message: "Job updated successfully" };
  } catch (error) {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(error.message);
  }
}

  async remove(id: number): Promise<{ message: string }> {
    try {
      const job = await this.jobRepo.findOne({ where: { id } });
      if (!job) throw new NotFoundException("Job not found");
      
      await this.jobRepo.delete(id);
      return { message: "Deleted job" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}