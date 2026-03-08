import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe, 
  HttpCode
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/shared/constants/user.role';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('Companies') // Swagger'da alohida bo'lim qiladi
@ApiBearerAuth("JWT-auth") // Swagger'da tokenni kiritish tugmasini chiqaradi
@Controller('companies')
@ApiInternalServerErrorResponse({description: "Internal server error"})
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post("add_company")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) 
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Yangi kompaniya qoʻshish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 201, description: 'Kompaniya muvaffaqiyatli qoʻshildi' })
  @ApiResponse({ status: 400, description: 'Bunday kompaniya allaqachon mavjud' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER) 
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Get("get_all_companies")
  @ApiOperation({ summary: 'Barcha kompaniyalar roʻyxatini olish' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER) 
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Get("get_company/:id")
  @ApiOperation({ summary: 'ID boʻyicha kompaniyani topish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) 
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Patch("update_company/:id")
  @ApiOperation({ summary: 'Kompaniya maʻlumotlarini yangilash (Faqat Admin, Superadmin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) 
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Delete('delete_company/:id')
  @ApiOperation({ summary: 'Kompaniyani oʻchirish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 200, description: 'Kompaniya oʻchirildi' })
  @ApiResponse({ status: 404, description: 'Kompaniya topilmadi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }

@Get('get_company_with_jobs/:id')
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
@UseGuards(AuthGuard, RolesGuard)
@HttpCode(200)
@ApiOperation({ summary: 'Kompaniya va uning barcha ish o\'rinlarini olish' })
async findCompanyWithJobs(@Param('id', ParseIntPipe) id: number) {
  return this.companiesService.findCompanyWithJobs(id);
}
}