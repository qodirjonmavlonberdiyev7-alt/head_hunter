// src/module/cities/cities.service.ts

import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from "@nestjs/common";
import { City } from "./entities/city.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCityDto } from "./dto/create-city.dto";
import { Repository } from "typeorm";
import { UpdateCityDto } from "./dto/update-city.dto";
import { EnumCity } from "src/shared/constants/city";

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private cityRepo: Repository<City>) {}

  async create(createCityDto: CreateCityDto): Promise<{ message: string }> {
    try {
      const foundedCity = await this.cityRepo.findOne({
        where: { name: createCityDto.name },
      });

      if (foundedCity)
        throw new BadRequestException("Bunday shahar allaqachon mavjud");

      const city = this.cityRepo.create(createCityDto);
      await this.cityRepo.save(city);

      return { message: "Shahar muvaffaqiyatli qo'shildi" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllCities(): Promise<City[]> {
    try {
      const cities = await this.cityRepo.find();
      if (cities.length === 0) throw new NotFoundException("Shaharlar topilmadi");
      return cities;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // findOne - nom bo'yicha (controllerga mos)
  async findOne(name: EnumCity): Promise<City> {
    try {
      const city = await this.cityRepo.findOne({ where: { name } });
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${name}`);
      return city;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // findCityWithJobs - nom bo'yicha (controllerga mos)
  async findCityWithJobs(name: EnumCity): Promise<City> {
    try {
      const city = await this.cityRepo.findOne({ 
        where: { name },
        relations: ['jobs', 'jobs.company', 'jobs.skills']
      });
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${name}`);
      return city;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // findCityCompaniesWithJobs - nom bo'yicha (controllerga mos)
  async findCityCompaniesWithJobs(name: EnumCity): Promise<any> {
    try {
      const city = await this.cityRepo.findOne({ 
        where: { name },
        relations: ['jobs', 'jobs.company', 'jobs.skills']
      });
      
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${name}`);

      // Unikal kompaniyalarni olish
      const companiesMap = new Map();
      city.jobs.forEach(job => {
        if (job.company && !companiesMap.has(job.company.id)) {
          companiesMap.set(job.company.id, {
            id: job.company.id,
            name: job.company.name,
            description: job.company.description,
            website: job.company.website,
            phoneNumber: job.company.phoneNumber,
            jobs: city.jobs
              .filter(j => j.company?.id === job.company.id)
              .map(j => ({
                id: j.id,
                title: j.title,
                description: j.description,
                level: j.level,
                employmentType: j.employmentType,
                salary: j.salary,
                skills: j.skills.map(skill => skill.name)
              }))
          });
        }
      });

      return {
        city: { 
          id: city.id, 
          name: city.name, 
          region: city.region 
        },
        companies: Array.from(companiesMap.values()),
        totalJobs: city.jobs.length
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // update - nom bo'yicha (controllerga mos)
  async update(name: EnumCity, updateCityDto: UpdateCityDto): Promise<{ message: string }> {
    try {
      // Shaharni nom bo'yicha topamiz
      const city = await this.cityRepo.findOne({ where: { name } });
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${name}`);

      // Yangilash
      await this.cityRepo.update(city.id, updateCityDto);
      
      return { message: "Shahar muvaffaqiyatli yangilandi" };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  // remove - nom bo'yicha (controllerga mos)
  async remove(name: EnumCity): Promise<{ message: string }> {
    try {
      // Shaharni nom bo'yicha topamiz
      const city = await this.cityRepo.findOne({ where: { name } });
      if (!city) throw new NotFoundException(`Shahar topilmadi: ${name}`);

      // O'chirish
      await this.cityRepo.delete(city.id);
      
      return { message: "Shahar o'chirildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}