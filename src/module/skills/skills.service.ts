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
  constructor(@InjectRepository(Skill) private skillsRepo: Repository<Skill>) {}
  async create(createSkillDto: CreateSkillDto): Promise<{ message: string }> {
    try {
      const { name } = createSkillDto;

      const enumSkillName = EnumSkills[name as keyof typeof EnumSkills];

      if (!enumSkillName) throw new BadRequestException("Invalid skill name");

      const foundedSkill = await this.skillsRepo.findOne({
        where: { name: enumSkillName },
      });

      if (foundedSkill)
        throw new BadRequestException("This skill already exists");

      const skill = await this.skillsRepo.create({
        name: enumSkillName,
      });

      await this.skillsRepo.save(skill);

      return { message: "Skill added" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllSkills(): Promise<Skill[] | null> {
    try {
      const foundedskills = await this.skillsRepo.find();
      if (foundedskills.length === 0)
        throw new NotFoundException("No skills found");
      return foundedskills;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Skill> {
    try {
      const foundedSkill = await this.skillsRepo.findOne({ where: { id } });
      if (!foundedSkill) throw new NotFoundException("Skill not found");

      return foundedSkill;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      const foundedCity = await this.skillsRepo.findOne({ where: { id } });
      if (!foundedCity) throw new NotFoundException("Skill not found");

      let enumSkillName: EnumSkills | undefined = undefined;
      if (updateSkillDto.name) {
        enumSkillName =
          EnumSkills[updateSkillDto.name as keyof typeof EnumSkills];
        if (!enumSkillName) throw new BadRequestException("Invalid skill name");
      }
      await this.skillsRepo.update(id, {
        ...updateSkillDto,
        name: enumSkillName,
      });
      return { message: "Skill updated" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async  remove(id: number): Promise<{message: string}> {
    try {
      const foundedSkill = await this.skillsRepo.findOne({where: {id}})
    if(!foundedSkill) throw new NotFoundException("Skill not found")
    await this.skillsRepo.delete(foundedSkill.id)
    return {message: "Deleted skill"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
