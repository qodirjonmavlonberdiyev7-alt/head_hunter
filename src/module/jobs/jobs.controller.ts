import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user.role";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UpdateJobDto } from "./dto/update-job.dto";
import { PaginationDto } from "src/shared/utils/pagination";

@ApiTags("Jobs")
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard)
@Controller("jobs")
@ApiInternalServerErrorResponse({description: "Internal server error"})
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("add_job")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi vakansiya yaratish (Faqat Admin)" })
  @ApiResponse({
    status: 201,
    description: "Vakansiya muvaffaqiyatli yaratildi",
  })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get("get_all_jobs")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @HttpCode(200)
  @ApiOperation({ summary: "Barcha aktiv vakansiyalar roʻyxatini olish, Filtr va Pagination bilan barcha vakansiyalarni olish" })
  findAll(@Query() paginationDto: PaginationDto, // page va limit shu yerda
  @Query('cityId') cityId?: number,
  @Query('companyId') companyId?: number,
  @Query('search') search?: string) {
    return this.jobsService.findAll(paginationDto, { cityId, companyId, search });
  }

  @Get("get_job/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  @HttpCode(200)
  @ApiOperation({ summary: "ID boʻyicha vakansiyani topish" })
  @ApiResponse({ status: 200, description: "Vakansiya topildi" })
  @ApiResponse({ status: 404, description: "Vakansiya topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @Patch("update_job/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Vakansiya maʻlumotlarini yangilash (Faqat Admin)" })
  @ApiResponse({
    status: 200,
    description: "Vakansiya muvaffaqiyatli yangilandi",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete("delete_job/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Vakansiyani oʻchirish (Faqat Admin)' })
  @ApiResponse({ status: 200, description: 'Vakansiya oʻchirildi' })
  @ApiResponse({ status: 404, description: 'Vakansiya topilmadi' })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}
 