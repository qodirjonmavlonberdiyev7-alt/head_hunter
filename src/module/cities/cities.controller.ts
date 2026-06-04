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

@ApiTags("Cities")
@ApiBearerAuth("JWT-auth")
@Controller("cities")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post("add_city")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi shahar qoʻshish (Faqat Admin, Superadmin)" })
  @ApiBody({ type: CreateCityDto })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get("get_all_cities")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Barcha shaharlar roʻyxatini olish" })
  findAll() {
    return this.citiesService.findAllCities();
  }

  @Get("get_one_city/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Nomi boʻyicha shaharni topish" })
  @ApiParam({ name: 'name', type: 'string', example: 'Tashkent' })
  findOne(@Param('name') name: string) {
    return this.citiesService.findOne(name);
  }

  @Patch("update_city/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shahar maʻlumotlarini yangilash (Faqat Admin, Superadmin)" })
  @ApiParam({ name: 'name', type: 'string', example: 'Tashkent' })
  @ApiBody({ type: UpdateCityDto })
  update(@Param("name") name: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(name, updateCityDto);
  }

  @Delete("delete_city/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shaharni oʻchirish (Faqat Admin, Superadmin)" })
  @ApiParam({ name: 'name', type: 'string', example: 'Tashkent' })
  remove(@Param("name") name: string) {
    return this.citiesService.remove(name);
  }

  @Get("get_city_with_jobs/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shahar va undagi barcha ish o'rinlarini olish" })
  @ApiParam({ name: 'name', type: 'string', example: 'Tashkent' })
  findCityWithJobs(@Param("name") name: string) {
    return this.citiesService.findCityWithJobs(name);
  }

  @Get("get_city_companies/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: "Shahardagi kompaniyalar va ularning ish o'rinlarini olish" })
  @ApiParam({ name: 'name', type: 'string', example: 'Tashkent' })
  findCityCompaniesWithJobs(@Param("name") name: string) {
    return this.citiesService.findCityCompaniesWithJobs(name);
  }
}
