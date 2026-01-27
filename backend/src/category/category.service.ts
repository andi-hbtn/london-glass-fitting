import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { Repository } from 'typeorm';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { HttpStatus } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryResponse, DeleteCategoryResponse } from './responseType/response.interface';
import * as fs from "fs";

@Injectable()
export class CategoryService {
	constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) { }

	public async getAllCategory(): Promise<CategoryEntity[]> {
		try {
			const result = await this.categoryRepository.find({
				relations: {
					products: true
				}
			});
			return result;
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async createCategory(data: CategoryDto): Promise<CategoryResponse> {
		try {
			const result = await this.categoryRepository.save(data);
			return {
				statusCode: HttpStatus.CREATED,
				message: 'Category created successfully',
				data: result
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateCategory(data: CategoryDto, id: number, file?: string): Promise<CategoryResponse> {
		try {
			const category = { title: data.title, image: file }
			await this.categoryRepository.update(id, category);
			const result = await this.categoryRepository.findOne({ where: { id } });
			return {
				statusCode: HttpStatus.CREATED,
				message: 'Category updated successfully',
				data: result
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async getCategoryById(id: number): Promise<CategoryResponse> {
		try {
			const result = await this.categoryRepository.findOne({
				where: { id },
				relations: {
					products: {
						colorVariants: true
					}
				}
			})
			if (!result) {
				throw new ServiceHandler("this category does not exist", HttpStatus.NOT_FOUND);
			}
			return {
				statusCode: HttpStatus.OK,
				message: 'Category exists',
				data: result
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async deleteCategory(id: number): Promise<DeleteCategoryResponse> {
		try {
			const result = await this.categoryRepository.findOne({ where: { id }, relations: { products: { colorVariants: true } } });
			if (!result) {
				throw new ServiceHandler("this category does not exist", HttpStatus.NOT_FOUND);
			}

			if (fs.existsSync(`uploads/${result.image}`)) {
				fs.unlinkSync('uploads/' + result.image);
			}

			for (const product of result.products) {
				if (product.image && fs.existsSync(`uploads/${product.image}`)) {
					fs.unlinkSync(`uploads/${product.image}`);
				}
				for (const variant of product.colorVariants) {
					if (variant.color_image && fs.existsSync(`uploads/colors/${variant.color_image}`)) {
						fs.unlinkSync(`uploads/${variant.color_image}`);
					}
					if (variant.main_image && fs.existsSync(`uploads/colors/${variant.main_image}`)) {
						fs.unlinkSync(`uploads/colors/${variant.main_image}`);
					}
				}
			}
			await this.categoryRepository.delete(id);
			return {
				statusCode: 200,
				message: "Category deleted successfully"
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}
}