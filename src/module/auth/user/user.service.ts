import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "../entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(Auth) private userRepository: Repository<Auth>) {}

    async findOrCreate(userData: Partial<Auth>): Promise<Auth> {
        const foundedUser = await this.userRepository.findOne({
            where: {email: userData.email}
        })

        if(foundedUser){
            return foundedUser
        }

        const user = this.userRepository.create(userData)
        return await this.userRepository.save(user)
    }

    async findByEmail(email: string): Promise<Auth | null>{
        return await this.userRepository.findOne({where: {email}})
    }
}