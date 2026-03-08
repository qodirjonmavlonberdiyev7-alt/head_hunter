import { BaseEntity } from "src/database/base.entity";
import { Job } from "src/module/jobs/entities/job.entity";
import { EnumCity } from "src/shared/constants/city";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: 'city'})
export class City extends BaseEntity{
    @Column({ 
        type: 'enum', 
        enum: EnumCity,
        unique: true // Shahar nomi unikal bo'lishi kerak
    })
    name: EnumCity;

    @Column()
    region: string;

    //relations

    @OneToMany(() => Job, (job) => job.city)
    jobs: Job[]; 
}
