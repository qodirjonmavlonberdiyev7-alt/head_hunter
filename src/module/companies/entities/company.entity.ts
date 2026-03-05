import { BaseEntity } from 'src/database/base.entity';
import { Entity, PrimaryGeneratedColumn, Column,} from 'typeorm';

@Entity()
export class Company extends BaseEntity{
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  //relations

}