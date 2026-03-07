import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { EnumCompanies } from "src/shared/constants/companies";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<{ message: string }> {
    try {
      const { name, description, website, phoneNumber } = createCompanyDto;

      const enumCompanyName = EnumCompanies[name as keyof typeof EnumCompanies] || name;
      
      // Agar enumda bo'lmasa xatolik qaytarish (IsEnum validatoridan o'tsa ham, qo'shimcha xavfsizlik)
      if (!Object.values(EnumCompanies).includes(enumCompanyName as EnumCompanies)) {
        throw new BadRequestException("Invalid company name");
      }

      const foundedCompany = await this.companyRepo.findOne({
        where: { name: enumCompanyName as EnumCompanies },
      });

      if (foundedCompany)
        throw new BadRequestException("This company already exists");

      const company = this.companyRepo.create({
        name: enumCompanyName as EnumCompanies,
        description,
        website,
        phoneNumber
      });

      await this.companyRepo.save(company);

      return { message: "Company added" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      const companies = await this.companyRepo.find();
      if (companies.length === 0)
        throw new NotFoundException("No companies found");
      return companies;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Company> {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) throw new NotFoundException("Company not found");

      return company;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) throw new NotFoundException("Company not found");

      let enumCompanyName: EnumCompanies | undefined = undefined;
      if (updateCompanyDto.name) {
        enumCompanyName = EnumCompanies[updateCompanyDto.name as keyof typeof EnumCompanies] || updateCompanyDto.name;
        if (!Object.values(EnumCompanies).includes(enumCompanyName as EnumCompanies)) {
          throw new BadRequestException("Invalid company name");
        }
      }

      await this.companyRepo.update(id, {
        ...updateCompanyDto,
        name: enumCompanyName,
      });
      return { message: "Company updated" };
    } catch (error) {
      if (error instanceof (BadRequestException || NotFoundException)) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) throw new NotFoundException("Company not found");
      
      await this.companyRepo.delete(id);
      return { message: "Deleted company" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}