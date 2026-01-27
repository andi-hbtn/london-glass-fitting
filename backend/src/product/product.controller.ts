import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors, Res, UploadedFile, HttpStatus, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { PermissionGuard } from 'src/guards/permission.guards';
import { IsPublic } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ProductService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { ProductResponse, DeleteProductResponse, DeleteProductVariantResponse } from './responseType/response.interface';
import { diskStorage } from 'multer';
import { ImageNameHelper } from '../helpers/imageName.helper';
import { PdfNameHelper } from 'src/helpers/PdfNameHelper';
import { Response } from 'express';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from "fs";
import * as path from 'path';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { UpdateProductVariantDto } from './dto/updateProductVariant.dto';

@UseGuards(AuthGuard, PermissionGuard)
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@IsPublic()
	@Get('all')
	public async getAll() {
		try {
			return await this.productService.getAllProducts();
		} catch (error) {
			throw new ServiceHandler(error.response, error.status);
		}
	}

	@Roles('admin')
	@Post('create')
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'image', maxCount: 1 },
		{ name: 'pdf_file', maxCount: 1 }
	], {
		storage: diskStorage({
			destination: './uploads',
			filename: (req, file, cb) => {
				if (file.fieldname === 'image') {
					const imageName = new ImageNameHelper(file.originalname).getImageName();
					cb(null, imageName);
				} else if (file.fieldname === 'pdf_file') {
					const pdfName = new PdfNameHelper(file.originalname).getPdfName();
					cb(null, pdfName);
				} else {
					cb(null, file.originalname);
				}
			}
		})
	}))
	public async cretePost(
		@Body() bodyParam: ProductDto,
		@UploadedFiles() files: { image?: Express.Multer.File[], pdf_file?: Express.Multer.File[] }) {
		try {
			if (!files.image || !files.image[0]) {
				throw new ServiceHandler('Image file is required', HttpStatus.BAD_REQUEST);
			}
			const product = {
				title: bodyParam.title,
				description: bodyParam.description,
				reference_number: bodyParam.reference_number,
				is_active: bodyParam.is_active,
				category_id: bodyParam.category_id,
				image: files.image[0].filename,
				pdf_file: files.pdf_file && files.pdf_file[0] ? files.pdf_file[0].filename : null
			};

			return await this.productService.createProduct(product);
		} catch (error) {
			throw new ServiceHandler(error.response, error.status);
		}
	}

	@Roles('admin')
	@Put('update/:id')
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'image', maxCount: 1 },
				{ name: 'pdf_file', maxCount: 1 },
			],
			{
				storage: diskStorage({
					destination: './uploads',
					filename: (req, file, cb) => {
						if (file.fieldname === 'image') {
							const imageName = new ImageNameHelper(file.originalname).getImageName();
							cb(null, imageName);
						} else if (file.fieldname === 'pdf_file') {
							const pdfName = new PdfNameHelper(file.originalname).getPdfName();
							cb(null, pdfName);
						} else {
							cb(null, file.originalname);
						}
					},
				}),
			},
		),
	)
	public async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() bodyParam: ProductDto,
		@UploadedFiles()
		files: {
			image?: Express.Multer.File[];
			pdf_file?: Express.Multer.File[];
		},
	) {
		try {
			const productResponse = await this.productService.getProductById(id);
			const product = productResponse.data;

			let image = product.image;
			let pdfFile = product.pdf_file;

			// 🖼️ Image update (optional)
			if (files?.image?.[0]) {
				if (product.image && fs.existsSync(`uploads/${product.image}`)) {
					fs.unlinkSync(`uploads/${product.image}`);
				}
				image = files.image[0].filename;
			}

			// 📄 PDF update (optional)
			if (files?.pdf_file?.[0]) {
				if (product.pdf_file && fs.existsSync(`uploads/${product.pdf_file}`)) {
					fs.unlinkSync(`uploads/${product.pdf_file}`);
				}
				pdfFile = files.pdf_file[0].filename;
			}

			return await this.productService.updateProduct(
				bodyParam,
				id,
				image,
				pdfFile,
			);
		} catch (error) {
			throw new ServiceHandler(error.response || error.message, error.status);
		}
	}

	@IsPublic()
	@Get(':id')
	public async getById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponse> {
		try {
			return await this.productService.getProductById(id);
		} catch (error) {
			throw new ServiceHandler(error.response, error.status);
		}
	}
	@Roles('admin')
	@Delete('delete/:id')
	public async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteProductResponse> {
		try {
			return await this.productService.deleteProduct(id);
		} catch (error) {
			throw new ServiceHandler(error.response, error.status);
		}
	}
	@Roles('admin')
	@Post('product-variants/:productId')
	@UseInterceptors(FilesInterceptor('images', 10, {
		storage: diskStorage({
			destination: './uploads/colors',
			filename: (req, file, cb) => {
				const imageName = new ImageNameHelper(file.originalname).getImageName();
				cb(null, imageName);
			}
		}),
	}))
	public async createProductVariants(
		@Param('productId', ParseIntPipe) productId: number,
		@UploadedFiles() files: Express.Multer.File[],
		@Body() bodyParam: any
	) {
		try {
			const parsed = JSON.parse(bodyParam.productVariants);
			return await this.productService.uploadColorVariants(productId, files, parsed);
		} catch (error) {
			throw new ServiceHandler(error.message, error.status);
		}
	}

	@Roles('admin')
	@Put('product-variants/:id')
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'color_image', maxCount: 1 },
		{ name: 'main_image', maxCount: 1 },
	], {
		storage: diskStorage({
			destination: './uploads/colors',
			filename: (req, file, cb) => {
				const imageName = new ImageNameHelper(file.originalname).getImageName();
				cb(null, imageName);
			}
		}),
	}))
	public async updateProductVariants(
		@UploadedFiles() files: { color_image?: Express.Multer.File[]; main_image?: Express.Multer.File[] },
		@Body() bodyParam: UpdateProductVariantDto,
		@Param('id', ParseIntPipe) id: number
	) {
		try {
			return await this.productService.updateColorVariants(files, bodyParam, id);
		} catch (error) {
			throw new ServiceHandler(error.message, error.status);
		}
	}

	@Roles('admin')
	@Delete('product-variants/:id')
	public async deleteProductVariant(@Param('id', ParseIntPipe) id: number): Promise<DeleteProductVariantResponse> {
		try {
			return await this.productService.deleteProductVariant(id);
		} catch (error) {
			throw new ServiceHandler(error.response, error.status);
		}
	}

	@IsPublic()
	@Get('uploads/:path')
	public getImage(@Param() path: any, @Res() res: Response) {
		res.sendFile(path.path, { root: 'uploads' });
	}

	@IsPublic()
	@Get('uploads/colors/:path')
	public getColorVariants(@Param('path') path: any, @Res() res: Response) {
		res.sendFile(path, { root: 'uploads/colors' });
	}
}