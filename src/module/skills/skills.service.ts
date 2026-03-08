import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "./entities/skill.entity";
import { Repository } from "typeorm";
import { EnumSkills } from "src/shared/constants/skills";

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillsRepo: Repository<Skill>,
  ) {}
  async create(createSkillDto: CreateSkillDto): Promise<{ message: string }> {
    try {
      const foundedSkill = await this.skillsRepo.findOne({
        where: { name: createSkillDto.name },
      });

      if (foundedSkill)
        throw new BadRequestException("Bunday skill allaqachon mavjud");

      const skill = this.skillsRepo.create(createSkillDto);
      await this.skillsRepo.save(skill);

      return { message: "Skill muvaffaqiyatli qo'shildi" };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllSkills(): Promise<Skill[]> {
    try {
      const skills = await this.skillsRepo.find();
      if (skills.length === 0)
        throw new NotFoundException("Hozircha skillar yo'q");
      return skills;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Skill> {
    try {
      const foundedSkill = await this.skillsRepo.findOne({ where: { id } });

      // Agar topilmasa, NestJS ning tayyor 404 xatosini otamiz
      if (!foundedSkill) throw new NotFoundException("Skill topilmadi");

      return foundedSkill;
    } catch (error) {
      // AGAR xatolik allaqachon NestJS xatosi bo'lsa (404, 400), uni o'zgartirmasdan qaytaramiz
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // FAQAT kutilmagan (baza o'chib qolsa, mantiqiy xato va h.k.) xatolarni 500 qilamiz
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      const skill = await this.skillsRepo.findOne({ where: { id } });
      if (!skill) throw new NotFoundException("Skill topilmadi");

      await this.skillsRepo.update(id, updateSkillDto);
      return { message: "Skill muvaffaqiyatli yangilandi" };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      // 1. Avval bazadan qidiramiz
      const foundedSkill = await this.skillsRepo.findOne({ where: { id } });

      // 2. Agar topilmasa, 404 xatosini otamiz
      if (!foundedSkill) {
        throw new NotFoundException(`ID: ${id} bo'lgan skill topilmadi`);
      }

      // 3. O'chirish amali
      await this.skillsRepo.delete(id);

      return { message: "Skill muvaffaqiyatli o'chirildi" };
    } catch (error) {
      // 4. Agar xatolik allaqachon NestJS xatosi (404) bo'lsa, uni o'zgartirmasdan qaytaramiz
      if (error instanceof NotFoundException) {
        throw error;
      }

      // 5. Boshqa kutilmagan xatolar (masalan, DB ulanishi) bo'lsa, 500 qaytaramiz
      throw new InternalServerErrorException(error.message);
    }
  }

  async findSkillWithJobs(id: number): Promise<Skill> {
  try {
    const skill = await this.skillsRepo.findOne({ 
      where: { id },
      relations: ['jobs', 'jobs.city', 'jobs.company']
    });
    if (!skill) throw new NotFoundException("Skill topilmadi");
    return skill;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException(error.message);
  }
}
}
