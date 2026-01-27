import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/products.entity';
import { ProductColorVariant } from './entity/productColorVariants.entity';
import { Repository } from 'typeorm';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { ProductDto } from "./dto/product.dto";
import { ProductResponse, AllProductResponse, DeleteProductResponse, DeleteProductVariantResponse } from './responseType/response.interface';
import * as fs from "fs"
import { ProductVariantDto } from './dto/productVariant.dto';
import { UpdateProductVariantDto } from './dto/updateProductVariant.dto';
@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(ProductEntity) private readonly ProductEntity: Repository<ProductEntity>,
		@InjectRepository(ProductColorVariant) private readonly ProductVariant: Repository<ProductColorVariant>
	) { }

	public async getAllProducts(): Promise<AllProductResponse> {
		try {
			const result = await this.ProductEntity.find({
				relations: ['category', 'colorVariants']
			});
			return {
				status: HttpStatus.OK,
				message: 'Product list',
				data: result
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async createProduct(data: ProductDto & { image: string; pdf_file?: string }): Promise<ProductResponse> {
		try {
			const productData = {
				...data,
				pdf_file: data.pdf_file || null
			};

			const result = await this.ProductEntity.save(productData);

			return {
				status: HttpStatus.OK,
				message: 'Product created successfully',
				data: result
			};
		} catch (error) {
			console.log("error-----", error);
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateProduct(
		data: ProductDto,
		id: number,
		image: string,
		pdf_file?: string,
	): Promise<any> {
		try {
			const product = {
				title: data.title,
				description: data.description,
				reference_number: data.reference_number,
				is_active: data.is_active,
				category_id: data.category_id,
				image: image,
				pdf_file: pdf_file ?? null,
			};

			await this.ProductEntity.update(id, product);

			const result = await this.ProductEntity.findOne({ where: { id } });

			return {
				status: HttpStatus.OK,
				message: 'Product updated successfully',
				data: result,
			};
		} catch (error) {
			console.log('error-in update--', error);
			throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async getProductById(id: number): Promise<ProductResponse> {
		try {
			const result = await this.ProductEntity.findOne({ where: { id }, relations: ['category', 'colorVariants'] });
			if (!result) {
				throw new ServiceHandler("this product does not exist", HttpStatus.NOT_FOUND);
			}
			return {
				status: HttpStatus.OK,
				message: 'Product exists',
				data: result
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async deleteProduct(id: number): Promise<DeleteProductResponse> {
		try {
			const result = await this.ProductEntity.findOne({ where: { id }, relations: ['colorVariants'] });
			if (!result) {
				throw new ServiceHandler("this product does not exist", HttpStatus.NOT_FOUND);
			}

			if (result.colorVariants.length > 0) {
				result.colorVariants.forEach((el) => {
					if (fs.existsSync(`uploads/colors/${el.color_image}`) || fs.existsSync(`uploads/colors/${el.main_image}`)) {
						fs.unlinkSync(`uploads/colors/${el.color_image}`);
						fs.unlinkSync(`uploads/colors/${el.main_image}`);
					}
				})
			}

			if (result.image) {
				if (fs.existsSync(`uploads/${result.image}`)) {
					fs.unlinkSync(`uploads/${result.image}`);
				}
			}

			if (result.pdf_file) {
				const pdfPath = `uploads/${result.pdf_file}`;
				if (fs.existsSync(pdfPath)) {
					fs.unlinkSync(pdfPath);
				}
			}

			await this.ProductEntity.delete(id);
			return {
				status: 200,
				message: "Product was successfully deleted"
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

	public async uploadColorVariants(
		productId: number,
		files: Express.Multer.File[],
		variants: ProductVariantDto[]
	): Promise<any> {
		try {
			const product = await this.ProductEntity.findOne({
				where: { id: productId },
				relations: ['colorVariants']
			});

			if (!product) {
				throw new ServiceHandler("Product not found", HttpStatus.NOT_FOUND);
			}

			await this.ProductVariant.save(
				variants.map((variant, index) => {
					const color_image = files[index * 2]?.filename;
					const main_image = files[index * 2 + 1]?.filename;
					return {
						product_id: productId,
						color: variant.colorName,
						price: +variant.price,
						stock: +variant.stock,
						reference: variant.reference,
						color_image,
						main_image
					};
				})
			);
			const result = await this.ProductEntity.findOne({
				where: { id: productId },
				relations: ['colorVariants']
			});

			return {
				status: HttpStatus.OK,
				message: 'Color images uploaded successfully',
				data: result,
			};
		} catch (error) {
			console.error("Error in uploadProductColors:", error);
			throw new ServiceHandler(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateColorVariants(
		files: any,
		variant: UpdateProductVariantDto,
		id: number
	): Promise<any> {
		try {
			const existingVariant = await this.ProductVariant.findOne({ where: { id: id } });
			if (!existingVariant) {
				throw new Error(`Variant with id not found`);
			}

			existingVariant.price = variant.price;
			existingVariant.stock = variant.stock;
			existingVariant.reference = variant.reference;
			existingVariant.color = variant.color;

			const color_image = files.color_image?.[0];
			const main_image = files.main_image?.[0];


			if (color_image) {
				if (fs.existsSync(`uploads/colors/${existingVariant.color_image}`)) {
					fs.unlinkSync(`uploads/colors/${existingVariant.color_image}`);
				}
				existingVariant.color_image = color_image.filename;
			}

			if (main_image) {
				if (fs.existsSync(`uploads/colors/${existingVariant.main_image}`)) {
					fs.unlinkSync(`uploads/colors/${existingVariant.main_image}`);
				}
				existingVariant.main_image = main_image.filename;
			}

			const updateProductVariant = this.ProductVariant.create(existingVariant);
			const newProductVariant = await this.ProductVariant.save(updateProductVariant);

			return {
				status: HttpStatus.OK,
				message: 'Color images uploaded successfully',
				data: newProductVariant,
			};
		} catch (error) {
			console.error("Error in uploadProductColors:", error);
			throw new ServiceHandler(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteProductVariant(id: number): Promise<DeleteProductVariantResponse> {
		try {
			const result = await this.ProductVariant.findOne({ where: { id } });
			if (!result) {
				throw new ServiceHandler("This product does not exist", HttpStatus.NOT_FOUND);
			}
			if (fs.existsSync(`uploads/colors/${result.color_image}`) || fs.existsSync(`uploads/colors/${result.main_image}`)) {
				fs.unlinkSync(`uploads/colors/${result.color_image}`);
				fs.unlinkSync(`uploads/colors/${result.main_image}`);
			}
			await this.ProductVariant.delete(id);
			return {
				status: 200,
				message: "Product Variant was successfully deleted"
			};
		} catch (error) {
			throw new ServiceHandler(error.message, HttpStatus.NOT_FOUND);
		}
	}

}
