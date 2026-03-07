import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './jwt-strategy';
import { GoogleStrategy } from './google-strategy';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      global: true,
      secret: String(process.env.SECRET),
      signOptions: {expiresIn: '60d'},
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
