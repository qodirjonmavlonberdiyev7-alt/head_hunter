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

  // src/module/jobs/jobs.service.ts - create metodini o'zgartiring

async create(createJobDto: CreateJobDto): Promise<{ message: string }> {
  try {
    const { cityName, companyName, skillNames, ...jobData } = createJobDto;

    // 1. Shaharni nomi bo'yicha topish
    const city = await this.cityRepo.findOne({ where: { name: cityName } });
    if (!city) throw new NotFoundException(`Shahar topilmadi: ${cityName}`);

    // 2. Kompaniyani nomi bo'yicha topish
    const company = await this.companyRepo.findOne({ where: { name: companyName } });
    if (!company) throw new NotFoundException(`Kompaniya topilmadi: ${companyName}`);

    // 3. Skillarni nomlari bo'yicha topish
    const skills = await this.skillRepo.find({ where: skillNames.map(name => ({ name })) });
    
    // Barcha skillar topilganligini tekshirish
    if (skills.length !== skillNames.length) {
      const foundSkillNames = skills.map(s => s.name);
      const missingSkills = skillNames.filter(name => !foundSkillNames.includes(name));
      throw new NotFoundException(`Quyidagi skillar topilmadi: ${missingSkills.join(', ')}`);
    }

    // 4. Job yaratish va bog'lash
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

  // src/module/jobs/jobs.service.ts - update metodini qo'shimcha qilish

async update(id: number, updateJobDto: UpdateJobDto) {
  try {
    const job = await this.findOne(id);
    
    const updateData: any = { ...updateJobDto };
    
    // Agar cityName berilgan bo'lsa, city ni yangilash
    if (updateJobDto.cityName) {
      const city = await this.cityRepo.findOne({ where: { name: updateJobDto.cityName } });
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${updateJobDto.cityName}`);
      updateData.city = city;
      delete updateData.cityName;
    }
    
    // Agar companyName berilgan bo'lsa, company ni yangilash
    if (updateJobDto.companyName) {
      const company = await this.companyRepo.findOne({ where: { name: updateJobDto.companyName } });
      if (!company) throw new NotFoundException(`Kompaniya topilmadi: ${updateJobDto.companyName}`);
      updateData.company = company;
      delete updateData.companyName;
    }
    
    // Agar skillNames berilgan bo'lsa, skills ni yangilash
    if (updateJobDto.skillNames) {
      const skills = await this.skillRepo.find({ where: updateJobDto.skillNames.map(name => ({ name })) });
      if (skills.length !== updateJobDto.skillNames.length) {
        const foundSkillNames = skills.map(s => s.name);
        const missingSkills = updateJobDto.skillNames.filter(name => !foundSkillNames.includes(name));
        throw new NotFoundException(`Quyidagi skillar topilmadi: ${missingSkills.join(', ')}`);
      }
      updateData.skills = skills;
      delete updateData.skillNames;
    }
    
    // Qolgan ma'lumotlarni yangilash
    await this.jobRepo.save({ ...job, ...updateData });
    
    return { message: "Job updated successfully" };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException)
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
