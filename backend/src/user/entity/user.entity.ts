import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { OrderEntity } from "src/order/entity/order.entity";

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstname: string;

	@Column()
	lastname: string;

	@Column()
	company_name: string;

	@Column()
	company_address: string;

	@Column()
	phone: string;

	@Column()
	email: string;

	@Column({ default: 'guest' })
	roles: string;

	@Column({ default: true })
	is_guest: boolean;

	@Column()
	password: string;

	@Column({ nullable: true })
	country: string | null;

	@Column({ nullable: true })
	town: string | null;

	@Column({ nullable: true })
	zipCode: string | null;

	@Column({ nullable: true })
	appartment: string | null;

	@Column()
	address: string;

	@Column({ nullable: true })
	message: string | null;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@OneToMany(() => OrderEntity, order => order.user)
	order: OrderEntity[]

	@Column({ nullable: true })
	passwordResetToken: string;

	@Column({ nullable: true })
	passwordResetExpires: Date;
}