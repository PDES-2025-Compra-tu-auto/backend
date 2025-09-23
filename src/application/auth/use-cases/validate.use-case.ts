import { Injectable } from "@nestjs/common";
import { UserActiveI } from "src/infraestructure/interfaces/user-active.interface";

@Injectable()
export class ValidateUseCase {
    constructor() {}
    
    async execute(userConnected: UserActiveI) {
        return {valid: true, ...userConnected}
    }
}