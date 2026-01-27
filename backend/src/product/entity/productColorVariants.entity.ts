// src/product/entity/product_color_image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './products.entity';

@Entity('product_variants')
export class ProductColorVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    reference: string;

    @Column()
    color: string;

    @Column()
    color_image: string;

    @Column()
    main_image: string;

    @ManyToOne(() => ProductEntity, (product) => product.colorVariants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column()
    product_id: number;
}
