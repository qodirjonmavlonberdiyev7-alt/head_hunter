import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/shared/constants/user.role';

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard)
@Controller('skills')
@ApiInternalServerErrorResponse({description: "Internal server error"})
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('add_skill')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBody({type: CreateSkillDto})
  @HttpCode(201)
  @ApiOperation({ summary: 'Yangi koʻnikma qoʻshish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 201, description: 'Skill muvaffaqiyatli qoʻshildi' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get('find_all_skills')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Barcha koʻnikmalar roʻyxatini olish' })
  findAll() {
    return this.skillsService.findAllSkills();
  }

  @Get('get_one_skill/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @HttpCode(200)
  @ApiOperation({ summary: 'ID boʻyicha koʻnikmani topish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  @Patch('update_skill/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBody({type: UpdateSkillDto})
  @HttpCode(200)
  @ApiOperation({ summary: 'Koʻnikmani yangilash (Faqat Admin, Superadmin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete('delete_skill/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Koʻnikmani oʻchirish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 200, description: 'Skill oʻchirildi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }

@Get('get_skill_with_jobs/:id')
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
@UseGuards(AuthGuard, RolesGuard)
@HttpCode(200)
@ApiOperation({ summary: 'Skill va undan foydalanadigan ish o\'rinlarini olish' })
findSkillWithJobs(@Param('id', ParseIntPipe) id: number) {
  return this.skillsService.findSkillWithJobs(id);
}
}
 