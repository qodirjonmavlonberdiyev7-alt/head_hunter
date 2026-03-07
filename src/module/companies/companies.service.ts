import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "./entities/company.entity";
import { Repository } from "typeorm";
import { CreateCompanyDto } from "./dto/create-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) 
    private companyRepo: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<{ message: string }> {
    try {
      const { name } = createCompanyDto;

      // Xuddi skills kabi, bir xil nomli kompaniya borligini tekshiramiz
      const foundedCompany = await this.companyRepo.findOne({
        where: { name },
      });

      if (foundedCompany)
        throw new BadRequestException("This company already exists");

      const company = this.companyRepo.create(createCompanyDto);
      await this.companyRepo.save(company);

      return { message: "Company added successfully" };
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

  async remove(id: number): Promise<{ message: string }> {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) throw new NotFoundException("Company not found");
      
      await this.companyRepo.delete(id);
      return { message: "Company deleted successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}