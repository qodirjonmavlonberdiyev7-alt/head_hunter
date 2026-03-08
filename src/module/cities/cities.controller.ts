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
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user.role";
import { EnumCity } from "src/shared/constants/city";

@ApiTags("Cities") // Swagger'da alohida bo'lim qiladi
@ApiBearerAuth("JWT-auth") // Swagger'da tokenni kiritish tugmasini chiqaradi
@Controller("cities")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post("add_city")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi shahar qoʻshish (Faqat Admin, Superadmin)" })
  @ApiResponse({ status: 201, description: "Shahar muvaffaqiyatli qoʻshildi." })
  @ApiResponse({ status: 400, description: "Bunday shahar allaqachon mavjud." })
  @ApiResponse({ status: 401, description: "Token xato yoki mavjud emas." })
  @ApiResponse({ status: 403, description: "Sizda huquq yetarli emas." })
  @ApiBody({ type: CreateCityDto })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get("get_all_cities")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Barcha shaharlar roʻyxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Shaharlar roʻyxati muvaffaqiyatli qaytarildi.",
  })
  findAll() {
    return this.citiesService.findAllCities();
  }

  @Get("get_one_city/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: " Nomi boʻyicha shaharni topish" })
  @ApiResponse({ status: 200, description: "Shahar topildi." })
  @ApiResponse({ status: 404, description: "Shahar topilmadi." })
   @ApiParam({ 
    name: 'name', 
    enum: EnumCity, 
    description: 'Shahar nomi (EnumCity dan)',
    example: EnumCity.Tashkent
  })
  findOne(@Param('name') name: EnumCity) {
    return this.citiesService.findOne(name);
  }

  @Patch("update_city/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: "Shahar maʻlumotlarini yangilash (Faqat Admin, Superadmin)",
  })
  @ApiParam({ 
    name: 'name', 
    enum: EnumCity, 
    description: 'Shahar nomi (EnumCity dan)',
    example: EnumCity.Tashkent
  }) 
  @ApiResponse({
    status: 200,
    description: "Shahar muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 404, description: "Shahar topilmadi." })
  @ApiBody({ type: UpdateCityDto })
  update(
    @Param("name") name: EnumCity,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.update(name, updateCityDto);
  }

  @Delete("delete_city/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shaharni oʻchirish (Faqat Admin, Superadmin)" })
  @ApiResponse({
    status: 200,
    description: "Shahar muvaffaqiyatli oʻchirildi.",
  })
  @ApiParam({ 
    name: 'name', 
    enum: EnumCity, 
    description: 'Shahar nomi (EnumCity dan)',
    example: EnumCity.Tashkent
  })
  @ApiResponse({ status: 404, description: "Shahar topilmadi." })
  remove(@Param("name") name: EnumCity) {
    return this.citiesService.remove(name);
  }

  @Get("get_city_with_jobs/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shahar va undagi barcha ish o'rinlarini olish" })
  @ApiParam({ 
    name: 'name', 
    enum: EnumCity, 
    description: 'Shahar nomi (EnumCity dan)',
    example: EnumCity.Tashkent
  })
  findCityWithJobs(@Param("name") name: EnumCity) {
    return this.citiesService.findCityWithJobs(name);
  }

  @Get("get_city_companies/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: "Shahardagi kompaniyalar va ularning ish o'rinlarini olish",
  })
  @ApiParam({ 
    name: 'name', 
    enum: EnumCity, 
    description: 'Shahar nomi (EnumCity dan)',
    example: EnumCity.Tashkent
  })
  findCityCompaniesWithJobs(@Param("name") name: EnumCity) {
    return this.citiesService.findCityCompaniesWithJobs(name);
  }
}
