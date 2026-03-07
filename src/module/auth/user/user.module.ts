import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "../entities/auth.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([Auth])],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}