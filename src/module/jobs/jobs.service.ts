import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Job } from "./entities/job.entity";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { City } from "../cities/entities/city.entity";
import { Company } from "../companies/entities/company.entity";
import { Skill } from "../skills/entities/skill.entity";
import { PaginationDto } from "src/shared/utils/pagination";

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    @InjectRepository(City) private cityRepo: Repository<City>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<{ message: string }> {
    try {
      const { cityId, companyId, skillIds, ...jobData } = createJobDto;

      // 1. Shahar va Kompaniyani tekshirish
      const city = await this.cityRepo.findOneBy({ id: cityId });
      if (!city) throw new NotFoundException("Shahar topilmadi");

      const company = await this.companyRepo.findOneBy({ id: companyId });
      if (!company) throw new NotFoundException("Kompaniya topilmadi");

      // 2. Skillarni topish
      const skills = await this.skillRepo.findBy({ id: In(skillIds) });

      // 3. Job yaratish va bog'lash
      const job = this.jobRepo.create({
        ...jobData,
        city,
        company,
        skills,
      });

      await this.jobRepo.save(job);
      return { message: "Vakansiya muvaffaqiyatli yaratildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

 async findAll(paginationDto: PaginationDto, filters: any): Promise<any> {
  try {
   const { page = 1, limit = 10 } = paginationDto;
    const { cityId, companyId, search } = filters;

    const queryBuilder = this.jobRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.city', 'city')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skills')
      .where('job.isActive = :active', { active: true });

      if (cityId) queryBuilder.andWhere('city.id = :cityId', { cityId });
    if (companyId) queryBuilder.andWhere('company.id = :companyId', { companyId });


    if (search) {
      queryBuilder.andWhere('(job.title ILIKE :search OR job.description ILIKE :search)', 
      { search: `%${search}%` });
    }

    const skip = (page - 1) * limit;
    const [items, total] = await queryBuilder
      .orderBy('job.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        limit: Number(limit)
      }
    };

   
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    // Baza ulanishida yoki Query yozishda xato bo'lsa 500 qaytadi
    throw new InternalServerErrorException(error.message);
  }
}

  async findOne(id: number): Promise<Job> {
    try {
      const job = await this.jobRepo.findOne({
         where: { id },
         relations: ['city', 'company', 'skills']
       });
      if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    try {
      const job = await this.findOne(id); // Mavjudligini tekshirish uchun findOne ni chaqiramiz

      await this.jobRepo.update(id, updateJobDto);
      return { message: "Job updated successfully" };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const job = await this.findOne(id); // findOne metodidagi xatolik boshqaruvidan foydalanamiz

      await this.jobRepo.delete(id);
      return { message: "Job deleted successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
