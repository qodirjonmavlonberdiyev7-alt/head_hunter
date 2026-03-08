// src/module/application/application.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/shared/constants/user.role";
import { ApplicationStatus } from "src/shared/constants/application-status"; // SHARED DAN IMPORT

@ApiTags("Applications")
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard)
@Controller("applications")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post("apply")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(201)
  @ApiOperation({ summary: "Vakansiyaga ariza yuborish" })
  @ApiResponse({ status: 201, description: "Ariza muvaffaqiyatli yuborildi" })
  @ApiResponse({ status: 400, description: "Siz allaqachon ariza bergansiz" })
  @ApiResponse({ status: 404, description: "Vakansiya topilmadi" })
  @ApiBody({ type: CreateApplicationDto })
  create(@Request() req: any, @Body() createApplicationDto: CreateApplicationDto) {
    const userId = req.user.id;
    return this.applicationService.create(userId, createApplicationDto);
  }

  @Get("my-applications")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Foydalanuvchining barcha arizalarini olish" })
  getMyApplications(@Request() req: any) {
    const userId = req.user.id;
    return this.applicationService.getUserApplications(userId);
  }

  @Get("my-applications/:id")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Bitta arizani ko'rish" })
  getOneApplication(@Request() req: any, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.applicationService.findOne(id, userId);
  }

  @Patch("my-applications/cancel/:id")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Arizani bekor qilish (faqat kutilayotgan)" })
  cancelApplication(@Request() req: any, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.applicationService.cancel(id, userId);
  }

  @Patch("my-applications/update/:id")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Arizani yangilash (faqat kutilayotgan)" })
  @ApiBody({ type: UpdateApplicationDto })
  updateApplication(
    @Request() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    const userId = req.user.id;
    return this.applicationService.update(id, userId, updateApplicationDto);
  }

  @Get("admin/all")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Barcha arizalarni ko'rish (Admin uchun)" })
  @ApiQuery({ name: "status", enum: ApplicationStatus, required: false })
  @ApiQuery({ name: "companyId", required: false })
  getAllApplicationsForAdmin(
    @Query("status") status?: ApplicationStatus,
    @Query("companyId") companyId?: number,
  ) {
    return this.applicationService.findAllForAdmin({ status, companyId });
  }

  @Patch("admin/status/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: "Ariza statusini yangilash (Admin uchun)" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: { 
          type: "string",
          enum: Object.values(ApplicationStatus),
          example: ApplicationStatus.REVIEWING
        },
        notes: { type: "string", example: "Hujjatlar tekshirilmoqda" },
      },
    },
  })
  updateApplicationStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: ApplicationStatus,
    @Body("notes") notes?: string,
  ) {
    return this.applicationService.updateStatus(id, status, notes);
  }
}