import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "./entities/city.entity";
import { Repository } from "typeorm";
import { EnumCity } from "src/shared/constants/city";

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private cityRepo: Repository<City>) {}
  async create(createCityDto: CreateCityDto): Promise<{ message: string }> {
    try {
      const { name, region } = createCityDto;

      const enumCityName = EnumCity[name as keyof typeof EnumCity];

      if (!enumCityName) throw new BadRequestException("Invalid city name");

      const foundedCity = await this.cityRepo.findOne({
        where: { name: enumCityName },
      });

      if (foundedCity)
        throw new BadRequestException("This City already exists");

      const city = this.cityRepo.create({
        name: enumCityName,
        region,
      });

      await this.cityRepo.save(city);

      return { message: "City added" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllCities(): Promise<City[]> {
    try {
      const foundedCities = await this.cityRepo.find();
      if (foundedCities.length === 0)
        throw new NotFoundException("No cities found");
      return foundedCities;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<City> {
    try {
      const foundedCity = await this.cityRepo.findOne({ where: { id } });
      if (!foundedCity) throw new NotFoundException("City not found");

      return foundedCity;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateCityDto: UpdateCityDto,
  ): Promise<{ message: string }> {
    const foundedCity = await this.cityRepo.findOne({ where: { id } });
    if (!foundedCity) throw new NotFoundException("City not found");

    let enumCityName: EnumCity | undefined = undefined;
    if (updateCityDto.name) {
      enumCityName = EnumCity[updateCityDto.name as keyof typeof EnumCity];
      if (!enumCityName) throw new BadRequestException("Invalid city name");
    }
    await this.cityRepo.update(id, {
      ...updateCityDto,
      name: enumCityName,
    });
    return { message: "City updated" };
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const foundedCity = await this.cityRepo.findOne({ where: { id } });
      if (!foundedCity) throw new NotFoundException("City not found");
      await this.cityRepo.delete(foundedCity.id);
      return { message: "Deleted city" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
