import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { ServiceHandler } from 'src/errorHandler/service.error';
@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }

	public async getAllUsers(): Promise<UserEntity[]> {
		try {
			const result = await this.usersRepository.find()
			return result;
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		try {
			const result = await this.usersRepository.findOneBy({ email })
			return result;
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async saveUser(user: UserEntity): Promise<UserEntity> {
		try {
			return await this.usersRepository.save(user);
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	public async registerUser(data: UserDto): Promise<UserEntity> {
		try {
			const result = await this.usersRepository.save(data);
			return result;
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async findById(id: number): Promise<UserEntity[]> {
		try {
			const result = await this.usersRepository.findBy({ id });
			return result;
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async setPasswordResetToken(
		userId: number,
		token: string,
		expires: Date
	): Promise<void> {
		await this.usersRepository.update(userId, {
			passwordResetToken: token,
			passwordResetExpires: expires
		});
	}

	public async findByResetToken(token: string): Promise<UserEntity> {
		return this.usersRepository.findOneBy({
			passwordResetToken: token
		});
	}

	public async updateUserPassword(
		userId: number,
		newPassword: string
	): Promise<void> {
		await this.usersRepository.update(userId, {
			password: newPassword
		});
	}

	public async clearResetToken(userId: number): Promise<void> {
		await this.usersRepository.update(userId, {
			passwordResetToken: null,
			passwordResetExpires: null
		});
	}
}