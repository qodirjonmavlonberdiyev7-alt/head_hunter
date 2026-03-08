import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { EnumCity } from "src/shared/constants/city";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: 'city'})
export class City extends BaseEntity{
    @Column({default: EnumCity.Tashkent})
    name: EnumCity;

    @Column({default: "Tashkent"})
    region: string;

    //relations

    @OneToMany(() => Job, (job) => job.city)
    jobs: Job[];
}
