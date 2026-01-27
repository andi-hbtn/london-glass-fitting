import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductColorVariant } from 'src/product/entity/productColorVariants.entity';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductColorVariant, { onDelete: 'SET NULL', eager: true, nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductColorVariant;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  color_image: string;

  @Column({ nullable: true })
  main_image: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}