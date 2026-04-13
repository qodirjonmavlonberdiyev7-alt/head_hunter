// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
//   UnauthorizedException,
// } from "@nestjs/common";
// import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
// import * as nodemailer from "nodemailer";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Auth } from "./entities/auth.entity";
// import { Repository } from "typeorm";
// import { JwtService } from "@nestjs/jwt";
// import * as bcrypt from "bcrypt";
// import { VerifyAuthDto } from "./dto/verify.dto";
// import { UserService } from "./user/user.service";

// @Injectable()
// export class AuthService {
//   private transporter: nodemailer.Transporter;
//   constructor(
//     @InjectRepository(Auth) private authRepository: Repository<Auth>,
//     private jwtService: JwtService,
//     private userService: UserService
//   ) {
//     this.transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "qodirjonmavlonberdiyev7@gmail.com",
//         pass: process.env.APP_KEY,
//       },
//     });
//   }

//   async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
//     try {
//       const { username, email, password } = createAuthDto;
//       const foundedUser = await this.authRepository.findOne({
//         where: { email },
//       });

//       if (foundedUser) throw new BadRequestException("Email already exists");

//       const hashPassword = await bcrypt.hash(password, 10);

//       const code = Array.from({ length: 6 }, () =>
//         Math.floor(Math.random() * 10),
//       ).join("");

//       await this.transporter.sendMail({
//         from: "qodirjonmavlonberdiyev7@gmail.com",
//         to: email,
//         subject: "Otp",
//         text: "Head_hunter.uz",
//         html: `<b>${code}</b>`,
//       });

//       const time = Date.now() + 120000;
//       const user = this.authRepository.create({
//         username,
//         email,
//         password: hashPassword,
//         otp: code,
//         otpTime: time,
//       });

//       await this.authRepository.save(user);
//       return { message: "Registered" };
//     } catch (error) {
//       throw new InternalServerErrorException(error.message);
//     }
//   }

//   // async verify(verifyAuthDto: VerifyAuthDto): Promise<{ access_token }> {
//   //   try {
//   //     const { email, otp } = verifyAuthDto;
//   //     const foundedUser = await this.authRepository.findOne({
//   //       where: { email },
//   //     });

//   //     if (!foundedUser) throw new BadRequestException("User not found");

//   //     const otpValidation = /^\d{6}$/.test(otp);

//   //     if (!otpValidation) throw new BadRequestException("Wrong otp validation");

//   //     const time = Date.now();
//   //     if (time > foundedUser.otpTime)
//   //       throw new BadRequestException("Otp expired");

//   //     if (otp !== foundedUser.otp) throw new BadRequestException("Wrong otp");

//   //     await this.authRepository.update(foundedUser.id, { otp: "", otpTime: 0 });

//   //     const payload = {
//   //       id: foundedUser.id,
//   //       email: foundedUser.email,
//   //       roles: foundedUser.role,
//   //     };
//   //     const access_token = await this.jwtService.signAsync(payload);
//   //     return {
//   //       access_token,
//   //     };
//   //   } catch (error) {
//   //     throw new InternalServerErrorException(error.message);
//   //   }
//   // }

//   async verify(verifyAuthDto: VerifyAuthDto): Promise<{ access_token: string }> {
//   try {
//     const { email, otp } = verifyAuthDto;
//     const foundedUser = await this.authRepository.findOne({
//       where: { email },
//     });

//     if (!foundedUser) throw new BadRequestException("User not found");

//     // "000000" development uchun master kod
//     if (otp !== '000000') {
//       const otpValidation = /^\d{6}$/.test(otp);
//       if (!otpValidation) throw new BadRequestException("Wrong otp validation");

//       const time = Date.now();
//       if (time > foundedUser.otpTime)
//         throw new BadRequestException("Otp expired");

//       if (otp !== foundedUser.otp) throw new BadRequestException("Wrong otp");
//     }

//     await this.authRepository.update(foundedUser.id, { otp: "", otpTime: 0 });

//     const payload = {
//       id: foundedUser.id,
//       email: foundedUser.email,
//       username: foundedUser.username,
//       roles: foundedUser.role,
//     };
//     const access_token = await this.jwtService.signAsync(payload);
//     return { access_token };
//   } catch (error) {
//     throw new InternalServerErrorException(error.message);
//   }
// }
  

//   async login(loginAuthDto: LoginAuthDto): Promise<{ message: string }> {
//     const { email, password } = loginAuthDto;
//     const foundedUser = await this.authRepository.findOne({ where: { email } });

//     if (!foundedUser) throw new UnauthorizedException("User not found");

//     const comp = await bcrypt.compare(password, foundedUser.password!);

//     if (comp) {
//       const code = Array.from({ length: 6 }, () =>
//         Math.floor(Math.random() * 10),
//       ).join("");

//       await this.transporter.sendMail({
//         from: "qodirjonmavlonberdiyev7@gmail.com",
//         to: email,
//         subject: "Otp",
//         text: "Head_hunter.uz",
//         html: `<b>${code}</b>`,
//       });

//       const time = Date.now() + 120000;

//       await this.authRepository.update(foundedUser.id, {
//         otp: code,
//         otpTime: time,
//       });

//       return { message: "Otp code sent ... Please check your email" };
//     } else {
//       return { message: "Wrong password" };
//     }
//   }

//   //google login

//   async googleLogin(userData: any){
//    const user =  await this.userService.findOrCreate(userData)

//   const payload = { id: user.id,  email: user.email, roles: user.role };
//   const access_token = await this.jwtService.signAsync(payload);
//       return {
//         access_token,
//         message: "Success"
//       }
//   }

//   async remove(id: number): Promise<boolean> {
//     await this.authRepository.delete(+id);
//     return true;
//   }
// }


import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
import * as nodemailer from "nodemailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "./entities/auth.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { VerifyAuthDto } from "./dto/verify.dto";
import { UserService } from "./user/user.service";

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private userService: UserService
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "qodirjonmavlonberdiyev7@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    try {
      const { username, email, password } = createAuthDto;
      const foundedUser = await this.authRepository.findOne({ where: { email } });
      if (foundedUser) throw new BadRequestException("Email already exists");

      const hashPassword = await bcrypt.hash(password, 10);
      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "qodirjonmavlonberdiyev7@gmail.com",
        to: email,
        subject: "OTP - HH.uz",
        html: `<h2>Tasdiqlash kodi: <b>${code}</b></h2>`,
      });

      const time = Date.now() + 120000;
      const user = this.authRepository.create({
        username, email,
        password: hashPassword,
        otp: code,
        otpTime: time,
      });
      await this.authRepository.save(user);
      return { message: "Registered" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verify(verifyAuthDto: VerifyAuthDto): Promise<{ access_token: string }> {
  try {
    const { email, otp } = verifyAuthDto;
    const foundedUser = await this.authRepository.findOne({ where: { email } });
    
    if (!foundedUser) throw new BadRequestException("Foydalanuvchi topilmadi");

    if (!/^\d{6}$/.test(otp)) throw new BadRequestException("Noto'g'ri kod formati");
    
    if (Date.now() > foundedUser.otpTime) throw new BadRequestException("Kod muddati o'tib ketdi. Qayta login qiling");
    
    if (otp !== foundedUser.otp) throw new BadRequestException("Noto'g'ri kod. Iltimos qayta tekshiring");

    await this.authRepository.update(foundedUser.id, { otp: "", otpTime: 0 });

    const payload = {
      id: foundedUser.id,
      email: foundedUser.email,
      username: foundedUser.username,
      roles: foundedUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

  async login(loginAuthDto: LoginAuthDto): Promise<{ message: string }> {
    const { email, password } = loginAuthDto;
    const foundedUser = await this.authRepository.findOne({ where: { email } });
    if (!foundedUser) throw new UnauthorizedException("User not found");

    const comp = await bcrypt.compare(password, foundedUser.password!);
    if (!comp) throw new UnauthorizedException("Wrong password");

    const code = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    await this.transporter.sendMail({
      from: "qodirjonmavlonberdiyev7@gmail.com",
      to: email,
      subject: "OTP - HH.uz",
      html: `<h2>Tasdiqlash kodi: <b>${code}</b></h2>`,
    });

    const time = Date.now() + 120000;
    await this.authRepository.update(foundedUser.id, { otp: code, otpTime: time });
    return { message: "Otp code sent" };
  }

  async googleLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);
    const payload = { id: user.id, email: user.email, roles: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, message: "Success" };
  }

  async remove(id: number): Promise<boolean> {
    await this.authRepository.delete(+id);
    return true;
  }
}