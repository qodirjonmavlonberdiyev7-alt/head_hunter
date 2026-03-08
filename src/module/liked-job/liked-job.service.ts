// src/module/liked-jobs/liked-jobs.service.ts
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException 
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { LikedJob } from "./entities/liked-job.entity";
import { CreateLikedJobDto } from "./dto/create-liked-job.dto";
import { LikedJobResponseDto } from "./dto/liked-job-response.dto";
import { Auth } from "../auth/entities/auth.entity";
import { Job } from "../jobs/entities/job.entity";

@Injectable()
export class LikedJobsService {
  constructor(
    @InjectRepository(LikedJob) private likedJobRepo: Repository<LikedJob>,
    @InjectRepository(Auth) private userRepo: Repository<Auth>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
  ) {}

  async likeJob(userId: number, dto: CreateLikedJobDto): Promise<{ message: string; data: LikedJobResponseDto }> {
    const job = await this.jobRepo.findOne({ 
      where: { id: dto.jobId, isActive: true },
      relations: ["company", "city", "skills"]
    });

    if (!job) throw new NotFoundException("Vakansiya topilmadi yoki faol emas");

    const existingLike = await this.likedJobRepo.findOne({
      where: { user: { id: userId }, job: { id: dto.jobId } }
    });

    if (existingLike) throw new BadRequestException("Bu ish allaqachon sevimlilarga qo'shilgan");

    const newLike = this.likedJobRepo.create({
      user: { id: userId },
      job: { id: dto.jobId }
    });

    const savedLike = await this.likedJobRepo.save(newLike);
    return { 
      message: "Vakansiya sevimlilarga qo'shildi", 
      data: this.mapToResponseDto(savedLike, job) 
    };
  }

  async unlikeJob(userId: number, jobId: number) {
    const like = await this.likedJobRepo.findOneBy({ user: { id: userId }, job: { id: jobId } });
    if (!like) throw new NotFoundException("Like topilmadi");
    await this.likedJobRepo.remove(like);
    return { message: "Sevimlilardan olib tashlandi" };
  }

  async getUserLikedJobs(userId: number): Promise<LikedJobResponseDto[]> {
    const likes = await this.likedJobRepo.find({
      where: { user: { id: userId } },
      relations: ["job", "job.company", "job.city", "job.skills"],
      order: { createdAt: "DESC" }
    });
    return likes.map(like => this.mapToResponseDto(like, like.job));
  }

  async checkIfLiked(userId: number, jobId: number) {
    const like = await this.likedJobRepo.findOneBy({ user: { id: userId }, job: { id: jobId } });
    return { liked: !!like, likedId: like?.id || null };
  }

  async checkBatchLiked(userId: number, jobIds: number[]) {
    const likes = await this.likedJobRepo.find({
      where: { user: { id: userId }, job: { id: In(jobIds) } },
      relations: ["job"]
    });
    
    const likedIdsMap = new Set(likes.map(l => l.job.id));
    return jobIds.map(id => ({ jobId: id, liked: likedIdsMap.has(id) }));
  }

  private mapToResponseDto(likedJob: LikedJob, job: any): LikedJobResponseDto {
    return {
      id: likedJob.id,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name || "Noma'lum",
      companyId: job.company?.id,
      cityName: job.city?.name || "Noma'lum",
      level: job.level,
      employmentType: job.employmentType,
      salary: Number(job.salary),
      skills: job.skills?.map(s => s.name) || [],
      likedAt: likedJob.createdAt,
    };
  }
}