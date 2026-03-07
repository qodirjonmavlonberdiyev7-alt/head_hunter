import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user.role";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";

@ApiTags('Jobs')
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("add_job")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) 
  @HttpCode(201)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER) 
  @HttpCode(200)
  @Get("get_all_jobs")
  findAll() {
    return this.jobsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) 
  @HttpCode(200)
  @Delete('delete_job/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}