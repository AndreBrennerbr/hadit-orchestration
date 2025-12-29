import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async singIn(@Body() loginDto: LoginDto) {
    return this.authService.singIn(loginDto.email, loginDto.password);
  }
}
