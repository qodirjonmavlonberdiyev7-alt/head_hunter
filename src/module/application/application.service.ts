import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "./entities/application.entity";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { Auth } from "../auth/entities/auth.entity";
import { Job } from "../jobs/entities/job.entity";
import { ApplicationResponseDto } from "./dto/application-response.dto";
import { ApplicationStatus } from "src/shared/constants/application-status";
import { PaginationDto } from "src/shared/utils/pagination";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    @InjectRepository(Auth)
    private userRepo: Repository<Auth>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async create(
    userId: number,
    createApplicationDto: CreateApplicationDto,
  ): Promise<{ message: string; application: ApplicationResponseDto }> {
    try {
      const { jobId, coverLetter, cvUrl } = createApplicationDto;

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

      const job = await this.jobRepo.findOne({
        where: { id: jobId, isActive: true },
        relations: ["company", "city"],
      });
      if (!job) throw new NotFoundException("Vakansiya topilmadi yoki aktiv emas");

      const existingApplication = await this.applicationRepo.findOne({
        where: { user: { id: userId }, job: { id: jobId } },
      });
      if (existingApplication) {
        throw new BadRequestException("Siz bu vakansiyaga allaqachon ariza bergansiz");
      }

      const application = this.applicationRepo.create({
        user,
        job,
        coverLetter,
        cvUrl,
        status: ApplicationStatus.PENDING,
      });

      const saved = await this.applicationRepo.save(application);
      return {
        message: "Ariza muvaffaqiyatli yuborildi",
        application: this.mapToResponseDto(saved, job),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserApplications(userId: number): Promise<ApplicationResponseDto[]> {
    try {
      const applications = await this.applicationRepo.find({
        where: { user: { id: userId } },
        relations: ["job", "job.company", "job.city", "job.skills"],
        order: { createdAt: "DESC" },
      });
      return applications.map((app) => this.mapToResponseDto(app, app.job));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, userId: number): Promise<ApplicationResponseDto> {
    try {
      const application = await this.applicationRepo.findOne({
        where: { id, user: { id: userId } },
        relations: ["job", "job.company", "job.city", "job.skills"],
      });
      if (!application) throw new NotFoundException("Ariza topilmadi");
      return this.mapToResponseDto(application, application.job);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancel(id: number, userId: number): Promise<{ message: string }> {
    try {
      const application = await this.applicationRepo.findOne({
        where: { id, user: { id: userId } },
      });
      if (!application) throw new NotFoundException("Ariza topilmadi");

      if (application.status !== ApplicationStatus.PENDING) {
        throw new BadRequestException("Faqat kutilayotgan arizalarni bekor qilish mumkin");
      }

      application.status = ApplicationStatus.CANCELLED;
      await this.applicationRepo.save(application);
      return { message: "Ariza muvaffaqiyatli bekor qilindi" };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    userId: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<{ message: string; application: ApplicationResponseDto }> {
    try {
      const application = await this.applicationRepo.findOne({
        where: { id, user: { id: userId } },
        relations: ["job", "job.company"],
      });
      if (!application) throw new NotFoundException("Ariza topilmadi");

      if (application.status !== ApplicationStatus.PENDING) {
        throw new BadRequestException("Faqat kutilayotgan arizalarni tahrirlash mumkin");
      }

      if (updateApplicationDto.coverLetter !== undefined) {
        application.coverLetter = updateApplicationDto.coverLetter;
      }
      if (updateApplicationDto.cvUrl !== undefined) {
        application.cvUrl = updateApplicationDto.cvUrl;
      }

      await this.applicationRepo.save(application);
      return {
        message: "Ariza muvaffaqiyatli yangilandi",
        application: this.mapToResponseDto(application, application.job),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllForAdmin(filters?: any, paginationDto?: PaginationDto): Promise<any> {
    try {
      const page = paginationDto?.page ?? 1;
      const limit = paginationDto?.limit ?? 20;
      const skip = (page - 1) * limit;

      const queryBuilder = this.applicationRepo
        .createQueryBuilder("app")
        .leftJoinAndSelect("app.user", "user")
        .leftJoinAndSelect("app.job", "job")
        .leftJoinAndSelect("job.company", "company")
        .orderBy("app.createdAt", "DESC")
        .skip(skip)
        .take(limit);

      if (filters?.status) {
        queryBuilder.andWhere("app.status = :status", { status: filters.status });
      }
      if (filters?.companyId) {
        queryBuilder.andWhere("company.id = :companyId", { companyId: filters.companyId });
      }

      const [applications, total] = await queryBuilder.getManyAndCount();

      return {
        data: applications.map((app) => ({
          id: app.id,
          user: { id: app.user.id, email: app.user.email, username: app.user.username },
          job: { id: app.job.id, title: app.job.title, company: app.job.company?.name },
          status: app.status,
          coverLetter: app.coverLetter,
          cvUrl: app.cvUrl,
          notes: app.notes,
          createdAt: app.createdAt,
        })),
        meta: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: Number(page),
          limit: Number(limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStatus(
    id: number,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<{ message: string }> {
    try {
      const application = await this.applicationRepo.findOne({ where: { id } });
      if (!application) throw new NotFoundException("Ariza topilmadi");

      application.status = status;
      if (notes) application.notes = notes;

      await this.applicationRepo.save(application);
      return { message: `Ariza statusi ${status} ga o'zgartirildi` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  private mapToResponseDto(application: any, job: any): ApplicationResponseDto {
    return {
      id: application.id,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name || "Noma'lum",
      status: application.status,
      coverLetter: application.coverLetter,
      cvUrl: application.cvUrl,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }
}
