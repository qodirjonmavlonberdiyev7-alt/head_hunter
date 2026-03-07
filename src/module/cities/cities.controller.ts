import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiBody({type: CreateCityDto})
  @HttpCode(200)
  @Post('add_city')
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @HttpCode(200)
  @Get('get_all_cities')
  findAll() {
    return this.citiesService.findAllCities();
  }

  @HttpCode(200)
  @Get('get_one_city/:id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(+id, updateCityDto);
  }

  @HttpCode(200)
  @Delete('delete_city/:id')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(+id);
  }
}
