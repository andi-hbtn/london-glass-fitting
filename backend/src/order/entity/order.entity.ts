import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { OrderItemEntity } from "./order_item.entity";
import { UserEntity } from "src/user/entity/user.entity";

@Entity('order')
export class OrderEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity | null;

	@OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, { cascade: true })
	orderItems: OrderItemEntity[];

	@Column('decimal', { precision: 10, scale: 2 })
	total_price: number;

	@Column({ type: 'enum', enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
	status: string;

	@Column()
	created_at: Date;
}