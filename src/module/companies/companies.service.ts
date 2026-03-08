import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "./entities/company.entity";
import { Repository } from "typeorm";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<{ message: string }> {
    try {
      // DTO da @IsEnum borligi uchun enum tekshiruvi bu yerda shart emas
      const foundedCompany = await this.companyRepo.findOne({
        where: { name: createCompanyDto.name },
      });

      if (foundedCompany)
        throw new BadRequestException("Bunday kompaniya allaqachon mavjud");

      const company = this.companyRepo.create(createCompanyDto);
      await this.companyRepo.save(company);

      return { message: "Kompaniya muvaffaqiyatli qo'shildi" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      const companies = await this.companyRepo.find();
      if (companies.length === 0) throw new NotFoundException("Kompaniyalar topilmadi");
      return companies;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Company> {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) throw new NotFoundException("Kompaniya topilmadi");
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      // Mavjudligini findOne orqali tekshiramiz
      await this.findOne(id);

      await this.companyRepo.update(id, updateCompanyDto);
      return { message: "Kompaniya muvaffaqiyatli yangilandi" };
    } catch (error) {
      // BU YERNI TUZATDIK:
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.companyRepo.delete(id);
      return { message: "Kompaniya o'chirildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCompanyWithJobs(id: number): Promise<Company> {
  try {
    const company = await this.companyRepo.findOne({ 
      where: { id },
      relations: ['jobs', 'jobs.city', 'jobs.skills'] // Kompaniya ishlarini va ularning city/skills larini yuklash
    });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");
    return company;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(error.message);
  }
}
}