import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { User } from "src/domain/user/entities/User";
import { UserRole } from "src/domain/user/enums/UserRole";
import { UserResponseDto } from "src/infraestructure/user/dto/user-response.dto";
import { Repository } from "typeorm";
import { DASHBOARD_PROFILE } from "../constants/dasboard";
import { UserDashboardDto } from "src/infraestructure/user/dto/user-dashboard.dto";
import { UpdateUserDto } from "src/infraestructure/user/dto/update-user.dto";

export class UserService {

    constructor(
        @InjectRepository(User) 
        private readonly userRespository: Repository<User>
    ){}

    async me(id:string){
        const user =await this.userRespository.findOne({ where: { id } });
        return plainToInstance(UserResponseDto,user,{excludeExtraneousValues:true})
    }

    async userProfiling(role:UserRole):Promise<UserDashboardDto[]>{
        return DASHBOARD_PROFILE[role]
    }
    async updateUser(id:string,fieldsToUpdate:UpdateUserDto){
        await this.userRespository.update(id,fieldsToUpdate)
        return {message:'User updated successfully'}
    }


}