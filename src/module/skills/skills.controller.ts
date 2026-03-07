import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateCityDto } from '../cities/dto/create-city.dto';
import { ApiBody, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Controller('skills')
@ApiInternalServerErrorResponse({description: "Internal server error"})
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiBody({type: CreateSkillDto})
  @HttpCode(200)
  @Post('add_skill')
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @HttpCode(200)
  @Get('find_all_skills')
  findAll() {
    return this.skillsService.findAllSkills();
  }

  @Get('get_one_skill/:id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Patch('update_skill/:id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete('delete_skill/:id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
