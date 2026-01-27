import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from "./dto/order.dto";
import { OrderEntity } from './entity/order.entity';
import { Response } from 'express';
import { ServiceHandler } from "../errorHandler/service.error";
import { OrderByIdResposne } from './responseType/response.interface';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('all')
  public async findAll(): Promise<OrderEntity[]> {
    return await this.orderService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderByIdResposne> {
    try {
      const result = await this.orderService.findOne(id);
      return result;
    } catch (error) {
      throw new ServiceHandler(error.message, error.status);
    }
  }

  @Get('user_order/:userId')
  public async getOrdersByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return this.orderService.getOrdersByUserId(userId);
    } catch (error) {
      throw new ServiceHandler(error.message, error.status);
    }
  }

  @Get('user_order_items/:userId')
  public async getOrderItemsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return this.orderService.getOrderItemsByUserId(userId);
    } catch (error) {
      throw new ServiceHandler(error.message, error.status);
    }
  }

  @Post('create')
  public async create(@Body() orderData: OrderDto): Promise<any> {
    return await this.orderService.create(orderData);
  }

  @Put('update-status/:id')
  public async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string): Promise<any> {
    return await this.orderService.updateStatus(id, status);
  }

  @Get('status/:status')
  public async getOrdersByStatus(@Param('status') status: string) {
    return await this.orderService.getOrdersByStatus(status);
  }

  @Get('uploads/:path')
  public getImage(@Param('status') path: any, @Res() res: Response) {
    res.sendFile(path.path, { root: 'uploads' });
  }

  @Get('uploads/colors/:path')
  public getColorVariants(@Param('path') path: any, @Res() res: Response) {
    res.sendFile(path, { root: 'uploads/colors' });
  }

}
