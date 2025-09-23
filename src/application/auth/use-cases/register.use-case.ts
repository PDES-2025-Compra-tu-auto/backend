import { RegisterDto } from "src/infraestructure/auth/dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RegisterUseCase {
    constructor(private readonly authService: AuthService) {
    }
    async execute(dto: RegisterDto) {
        return await this.authService.register(dto);
    }
}