import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { ApiBody } from '@nestjs/swagger';
import { VerifyAuthDto } from './dto/verify.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  authGoogle() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user)
  }
  @ApiBody({type: CreateAuthDto})
  @HttpCode(200)
  @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiBody({type: VerifyAuthDto})
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  @ApiBody({type: LoginAuthDto})
  @HttpCode(200)
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
