import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from 'src/infraestructure/auth/dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute({ email, password }: LoginDto) {
    return await this.authService.login(email, password);
  }
}
