import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(token: string) {
    return await this.authService.refreshToken(token);
  }
}
