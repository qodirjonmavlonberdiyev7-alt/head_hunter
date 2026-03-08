import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { CitiesService } from "./cities.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user.role";

@ApiTags("Cities") // Swagger'da alohida bo'lim qiladi
@ApiBearerAuth("JWT-auth") // Swagger'da tokenni kiritish tugmasini chiqaradi
@Controller("cities")
@ApiInternalServerErrorResponse({description: "Internal server error"})
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post("add_city")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Yangi shahar qoʻshish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 201, description: 'Shahar muvaffaqiyatli qoʻshildi.' })
  @ApiResponse({ status: 400, description: 'Bunday shahar allaqachon mavjud.' })
  @ApiResponse({ status: 401, description: 'Token xato yoki mavjud emas.' })
  @ApiResponse({ status: 403, description: 'Sizda huquq yetarli emas.' })
  @ApiBody({ type: CreateCityDto })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get("get_all_cities")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Barcha shaharlar roʻyxatini olish' })
  @ApiResponse({ status: 200, description: 'Shaharlar roʻyxati muvaffaqiyatli qaytarildi.' })
  findAll() {
    return this.citiesService.findAllCities();
  }

  @Get("get_one_city/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'ID boʻyicha shaharni topish' })
  @ApiResponse({ status: 200, description: 'Shahar topildi.' })
  @ApiResponse({ status: 404, description: 'Shahar topilmadi.' })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }

  @Patch("update_city/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Shahar maʻlumotlarini yangilash (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 200, description: 'Shahar muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 404, description: 'Shahar topilmadi.' })
  @ApiBody({type: UpdateCityDto})
  update(@Param("id", ParseIntPipe) id: number, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete("delete_city/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Shaharni oʻchirish (Faqat Admin, Superadmin)' })
  @ApiResponse({ status: 200, description: 'Shahar muvaffaqiyatli oʻchirildi.' })
  @ApiResponse({ status: 404, description: 'Shahar topilmadi.' })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.citiesService.remove(id);
  }

@Get("get_city_with_jobs/:id")
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
@UseGuards(AuthGuard, RolesGuard)
@HttpCode(200)
@ApiOperation({ summary: 'Shahar va undagi barcha ish o\'rinlarini olish' })
findCityWithJobs(@Param("id", ParseIntPipe) id: number) {
  return this.citiesService.findCityWithJobs(id);
}

@Get("get_city_companies/:id")
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
@UseGuards(AuthGuard, RolesGuard)
@HttpCode(200)
@ApiOperation({ summary: 'Shahardagi kompaniyalar va ularning ish o\'rinlarini olish' })
findCityCompaniesWithJobs(@Param("id", ParseIntPipe) id: number) {
  return this.citiesService.findCityCompaniesWithJobs(id);
}

}
