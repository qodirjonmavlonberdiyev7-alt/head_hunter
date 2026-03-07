import { BaseEntity } from "src/database/base.entity";
import { EnumCity } from "src/shared/constants/city";
import { Column, Entity } from "typeorm";

@Entity({name: 'city'})
export class City extends BaseEntity{
    @Column({default: EnumCity.Tashkent})
    name: EnumCity;

    @Column({default: "Tashkent"})
    region: string;
}
