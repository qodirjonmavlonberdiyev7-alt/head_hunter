import { BaseEntity } from "src/database/base.entity";
import { UserRole } from "src/shared/constants/user.role";
import { Column, Entity } from "typeorm";

@Entity({name: "auth"})
export class Auth extends BaseEntity{
    @Column({nullable: true})
    username: string;

    @Column()
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({default: 0})
    otp: string;

    @Column({type: "bigint"})
    otpTime: number;
    
    @Column({default: UserRole.USER})
    role: UserRole;

     //extra info
    @Column({nullable: true})
    firstname?: string;

    @Column({nullable: true})
    lastname?: string;

    @Column({nullable: true})
    profilePicture?: string;

    @Column({nullable: true})
    accessToken?: string;

    @Column({nullable: true})
    bio?: string;

    //relations

}
