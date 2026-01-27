import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CategoryEntity } from "src/category/entity/category.entity";
import { ProductColorVariant } from "./productColorVariants.entity";

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ length: 500 })
	description: string;

	@Column()
	reference_number: string;

	@Column({ default: true })
	is_active: boolean;

	@OneToMany(() => ProductColorVariant, (colorVariant) => colorVariant.product, { cascade: true })
	colorVariants: ProductColorVariant[];

	@ManyToOne(() => CategoryEntity, (category) => category.products, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'category_id' })
	category: CategoryEntity;

	@Column({ name: 'category_id', nullable: false })
	category_id: number;

	@Column()
	image: string;

	@Column()
	pdf_file: string;

}
