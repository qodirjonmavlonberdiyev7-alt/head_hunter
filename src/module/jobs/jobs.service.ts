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

  // Topilmasa avtomatik yaratadi
  private async findOrCreateCity(name: string): Promise<City> {
    const existing = await this.cityRepo.findOne({ where: { name } });
    if (existing) return existing;
    const city = this.cityRepo.create({ name, region: name });
    return this.cityRepo.save(city);
  }

  private async findOrCreateCompany(name: string): Promise<Company> {
    const existing = await this.companyRepo.findOne({ where: { name } });
    if (existing) return existing;
    const company = this.companyRepo.create({ name });
    return this.companyRepo.save(company);
  }

  private async findOrCreateSkills(names: string[]): Promise<Skill[]> {
    const skills: Skill[] = [];
    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const existing = await this.skillRepo.findOne({ where: { name: trimmed } });
      if (existing) {
        skills.push(existing);
      } else {
        const created = await this.skillRepo.save(this.skillRepo.create({ name: trimmed }));
        skills.push(created);
      }
    }
    return skills;
  }

  async create(createJobDto: CreateJobDto): Promise<{ message: string }> {
    try {
      const { cityName, companyName, skillNames, ...jobData } = createJobDto;

      const city = cityName ? await this.findOrCreateCity(cityName) : undefined;
      const company = await this.findOrCreateCompany(companyName);
      const skills = skillNames?.length ? await this.findOrCreateSkills(skillNames) : [];

      const job = this.jobRepo.create({ ...jobData, city, company, skills });
      await this.jobRepo.save(job);
      return { message: "Vakansiya muvaffaqiyatli yaratildi" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
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
        queryBuilder.andWhere(
          '(job.title ILIKE :search OR job.description ILIKE :search)',
          { search: `%${search}%` },
        );
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
          limit: Number(limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      const job = await this.jobRepo.findOne({
        where: { id },
        relations: ['city', 'company', 'skills'],
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
      const job = await this.findOne(id);
      const updateData: any = { ...updateJobDto };

      if (updateJobDto.cityName) {
        updateData.city = await this.findOrCreateCity(updateJobDto.cityName);
        delete updateData.cityName;
      }

      if (updateJobDto.companyName) {
        updateData.company = await this.findOrCreateCompany(updateJobDto.companyName);
        delete updateData.companyName;
      }

      if (updateJobDto.skillNames !== undefined) {
        updateData.skills = updateJobDto.skillNames?.length
          ? await this.findOrCreateSkills(updateJobDto.skillNames)
          : [];
        delete updateData.skillNames;
      }

      await this.jobRepo.save({ ...job, ...updateData });
      return { message: "Job updated successfully" };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.jobRepo.delete(id);
      return { message: "Job deleted successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
