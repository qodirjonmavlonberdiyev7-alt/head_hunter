import { BaseEntity } from "src/database/base.entity";
import { EnumCompanies } from "src/shared/constants/companies";
import { Column, Entity } from "typeorm";

@Entity()
export class Company extends BaseEntity {
  @Column({ type: 'enum', enum: EnumCompanies })
  name: EnumCompanies;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({nullable: true})
  phoneNumber: string;
}