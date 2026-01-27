import { OrderEntity } from "../entity/order.entity";

export interface OrderByIdResposne {
    statusCode: number,
    message: string,
    data: OrderEntity
}