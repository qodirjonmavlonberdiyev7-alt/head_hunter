import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { EnumSkills } from 'src/shared/constants/skills';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillsRepo: Repository<Skill>,
  ){}
async  create(createSkillDto: CreateSkillDto): Promise<{message: string}>{
    try {
      const {name} = createSkillDto

      const enumSkillName = EnumSkills[name as keyof typeof EnumSkills]

      if(!enumSkillName) throw new BadRequestException("Invalid skill name")
      
      const foundedSkill = await this.skillsRepo.findOne({where: {name: enumSkillName}})

      if(foundedSkill) throw new BadRequestException("This skill already exists")

        const skill = await this.skillsRepo.create({
          name: enumSkillName
        })

        await this.skillsRepo.save(skill)

        return {message: "Skill added"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

async  findAllSkills(): Promise<Skill[] | null> {
  try {
      const foundedskills = await this.skillsRepo.find()
    if(foundedskills.length === 0) throw new NotFoundException("No skills found")
      return foundedskills
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      }
    }


  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
  }

 
