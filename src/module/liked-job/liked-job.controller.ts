import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UserRole } from "src/shared/constants/user.role";
import { CreateLikedJobDto } from "./dto/create-liked-job.dto";
import { LikedJobsService } from "./liked-job.service";

// src/module/liked-jobs/liked-jobs.controller.ts
@ApiTags("Liked Jobs")
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard)
@Controller("liked-jobs")
export class LikedJobsController {
  constructor(private readonly likedJobsService: LikedJobsService) {}

  @Post("like")
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: "Vakansiyaga like bosish" })
  like(@Request() req: any, @Body() dto: CreateLikedJobDto) {
    return this.likedJobsService.likeJob(req.user.id, dto);
  }

  @Delete("unlike/:jobId")
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: "Like-ni bekor qilish" })
  unlike(@Request() req: any, @Param("jobId", ParseIntPipe) jobId: number) {
    return this.likedJobsService.unlikeJob(req.user.id, jobId);
  }

  @Get("my-list")
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening sevimlilarim" })
  findAll(@Request() req: any) {
    return this.likedJobsService.getUserLikedJobs(req.user.id);
  }

  @Get("check/:jobId")
  @Roles(UserRole.USER, UserRole.ADMIN)
  check(@Request() req: any, @Param("jobId", ParseIntPipe) jobId: number) {
    return this.likedJobsService.checkIfLiked(req.user.id, jobId);
  }

  @Get("check-batch")
  @Roles(UserRole.USER, UserRole.ADMIN)
  async checkBatch(@Request() req: any, @Query("jobIds") jobIds: string) {
    const ids = jobIds.split(",").map((id) => parseInt(id.trim()));
    return this.likedJobsService.checkBatchLiked(req.user.id, ids);
  }
}
