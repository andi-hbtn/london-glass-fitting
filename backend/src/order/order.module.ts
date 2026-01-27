import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { OrderEntity } from "./entity/order.entity";
import { ProductEntity } from '../product/entity/products.entity';
import { OrderItemEntity } from './entity/order_item.entity';
import { ProductColorVariant } from '../product/entity/productColorVariants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      ProductColorVariant,
      OrderEntity,
      OrderItemEntity
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }