import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { ServiceHandler } from "../errorHandler/service.error";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get('all')
	public async getAllUserCustomers(): Promise<UserEntity[]> {
		try {
			return this.userService.getAllUsers();
		} catch (error) {
			throw new ServiceHandler(error.message, error.status);
		}
	}
}
