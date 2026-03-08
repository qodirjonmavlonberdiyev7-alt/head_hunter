import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { City } from "./entities/city.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCityDto } from "./dto/create-city.dto";
import { Repository } from "typeorm";
import { UpdateCityDto } from "./dto/update-city.dto";

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private cityRepo: Repository<City>) {}

  async create(createCityDto: CreateCityDto): Promise<{ message: string }> {
    try {
      // DTO da @IsEnum borligi uchun enumCityName ni keyof orqali tekshirish shart emas
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

  async findOne(id: number): Promise<City> {
    try {
      const city = await this.cityRepo.findOne({ where: { id } });
      if (!city) throw new NotFoundException("Shahar topilmadi");
      return city;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<{ message: string }> {
    try {
      const city = await this.findOne(id); // findOne ichidagi 404 tekshiruvidan foydalanamiz

      await this.cityRepo.update(id, updateCityDto);
      return { message: "Shahar muvaffaqiyatli yangilandi" };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const city = await this.findOne(id);
      await this.cityRepo.delete(id);
      return { message: "Shahar o'chirildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCityWithJobs(id: number): Promise<City> {
  try {
    const city = await this.cityRepo.findOne({ 
      where: { id },
      relations: ['jobs', 'jobs.company', 'jobs.skills']
    });
    if (!city) throw new NotFoundException("Shahar topilmadi");
    return city;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(error.message);
  }
}

async findCityCompaniesWithJobs(id: number): Promise<any> {
  try {
    const city = await this.cityRepo.findOne({ 
      where: { id },
      relations: ['jobs', 'jobs.company', 'jobs.skills']
    });
    
    if (!city) throw new NotFoundException("Shahar topilmadi");

    // Unikal kompaniyalarni olish
    const companiesMap = new Map();
    city.jobs.forEach(job => {
      if (job.company && !companiesMap.has(job.company.id)) {
        companiesMap.set(job.company.id, {
          ...job.company,
          jobs: city.jobs.filter(j => j.company?.id === job.company.id)
        });
      }
    });

    return {
      city: { id: city.id, name: city.name, region: city.region },
      companies: Array.from(companiesMap.values()),
      totalJobs: city.jobs.length
    };
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(error.message);
  }
}

}