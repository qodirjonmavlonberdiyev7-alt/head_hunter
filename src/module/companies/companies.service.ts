import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "./entities/company.entity";
import { Repository } from "typeorm";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { PaginationDto } from "src/shared/utils/pagination";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<{ message: string }> {
    try {
      const foundedCompany = await this.companyRepo.findOne({
        where: { name: createCompanyDto.name },
      });
      if (foundedCompany) throw new BadRequestException("Bunday kompaniya allaqachon mavjud");

      const company = this.companyRepo.create(createCompanyDto);
      await this.companyRepo.save(company);
      return { message: "Kompaniya muvaffaqiyatli qo'shildi" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(paginationDto?: PaginationDto): Promise<any> {
    try {
      const page = paginationDto?.page ?? 1;
      const limit = paginationDto?.limit ?? 20;
      const skip = (page - 1) * limit;

      const [companies, total] = await this.companyRepo.findAndCount({
        skip,
        take: limit,
        order: { id: "ASC" },
      });

      return {
        data: companies,
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

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.companyRepo.update(id, updateCompanyDto);
      return { message: "Kompaniya muvaffaqiyatli yangilandi" };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
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
        relations: ["jobs", "jobs.city", "jobs.skills"],
      });
      if (!company) throw new NotFoundException("Kompaniya topilmadi");
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
