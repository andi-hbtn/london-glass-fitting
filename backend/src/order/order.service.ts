import { Injectable, HttpStatus, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entity/order.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { ProductEntity } from 'src/product/entity/products.entity';
import { ProductColorVariant } from 'src/product/entity/productColorVariants.entity';
import { OrderItemEntity } from './entity/order_item.entity';
import { OrderDto } from './dto/order.dto';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { OrderByIdResposne } from './responseType/response.interface';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as PdfPrinter from 'pdfmake/src/printer';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity) private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductColorVariant) private readonly productColorRepository: Repository<ProductColorVariant>,
    @InjectRepository(OrderEntity) private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity) private readonly orderItemsRepository: Repository<OrderItemEntity>,
    private configService: ConfigService,
  ) { }

  public async create(orderData: OrderDto): Promise<any> {
    try {
      const { user_id, items, total_price, status, created_at, firstname, lastname, company_name, company_address, phone, email, country, town, zipCode, appartment, address, message } = orderData;
      let user: UserEntity | null = null;

      // Check if user is auth and gethis data from DB
      if (user_id) {
        user = await this.usersRepository.findOne({ where: { id: user_id } });

        // Updata users data
        if (user) {
          this.usersRepository.merge(user, {
            company_name,
            company_address,
            country,
            town,
            zipCode,
            appartment,
            address,
            message,
          });
          await this.usersRepository.save(user);
        }
      }

      // Nëse përdoruesi nuk është i regjistruar, e krijoni një të ri
      if (!user) {
        user = this.usersRepository.create({
          firstname,
          lastname,
          company_name,
          company_address,
          phone,
          email,
          country,
          town,
          zipCode,
          appartment,
          message,
          address,
          password: Math.random().toString(36).slice(-8), // random, nuk përdoret për login
          roles: 'guest',
          createdAt: new Date(),
        });
        await this.usersRepository.save(user);
      }

      // Krijo një instancë të porosisë
      const order = this.ordersRepository.create({
        user: user, // Kjo tashmë është një instancë e plotë e `UserEntity`
        total_price,
        status,
        created_at,
      });

      // Ruaj porosinë
      const savedOrder = await this.ordersRepository.save(order);

      // Krijo artikujt e porosisë
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const product = await this.productsRepository.findOne({ where: { id: item.product_id } });
          const variant = await this.productColorRepository.findOne({ where: { id: item.variantId }, relations: ['product'] });

          // Kontrollo nëse ekzistojnë produktet dhe variacionet
          if (!product) throw new Error(`Product with ID ${item.product_id} not found`);
          if (!variant) throw new Error(`Product with this color and with ID ${item.variantId} not found`);
          // Kontrollo nëse ka mjaftueshëm stok
          if (item.quantity > variant.stock) throw new Error(`Not enough stock.`);

          // Përditëso stoku i produktit
          variant.stock -= item.quantity;
          await this.productColorRepository.save(variant);

          // Krijo artikujt e porosisë
          return this.orderItemsRepository.create({
            order: savedOrder,
            variant,
            color: item.color,
            color_image: item.color_image,
            main_image: item.main_image,
            price: item.price,
            quantity: item.quantity,
          });
        })
      );

      // Ruaj artikujt e porosisë
      const orderItem = await this.orderItemsRepository.save(orderItems);

      // Dërgo një email me detajet e porosisë
      await this.sendOrderWithEmail(savedOrder, orderItem, {
        phone,
        email,
        firstname,
        lastname,
        country,
        town,
        zipCode,
        appartment,
        message,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Success! We’ve received your order and it’s being prepared.',
        data: savedOrder,
      };
    } catch (error) {
      console.log("error--in create order---", error);
      throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateStatus(id: number, status: string): Promise<any> {
    try {

      const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new ServiceHandler(`Invalid status: ${status}`, HttpStatus.NOT_FOUND);
      }

      const order = await this.ordersRepository.findOne({ where: { id } });
      if (!order) {
        throw new ServiceHandler('Order not found', HttpStatus.NOT_FOUND);
      }

      await this.ordersRepository.update(id, { status: status });

      return await this.ordersRepository.findOne({
        where: { id },
        relations: ['user', 'orderItems']
      });

    } catch (error) {
      throw new ServiceHandler(error.response, error.status);
    }
  }

  public async findOne(id: number): Promise<OrderByIdResposne> {

    try {
      const result = await this.ordersRepository.findOne({
        where: { id }, relations: {
          user: true,
          orderItems: {
            variant: {
              product: {
                category: true
              }
            }
          }
        }
      });
      if (!result) {
        throw new ServiceHandler("This order was not found", HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: 200,
        message: "Order By Id",
        data: result
      };
    } catch (error) {
      throw new ServiceHandler(error.message, error.status);
    }
  }

  public async getOrdersByUserId(userId: number): Promise<any> {
    try {
      const orders = await this.ordersRepository.find({
        where: { user: { id: userId } },
        relations: {
          orderItems: {
            variant: {
              product: {
                category: true
              }
            }
          }
        },
        order: {
          created_at: 'DESC'
        }
      });

      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'firstname', 'lastname', 'email', 'phone', 'country', 'town', 'zipCode', 'appartment', 'message', 'createdAt', 'roles'] // mos merr password
      });

      return {
        statusCode: 200,
        user,
        orders
      };

    } catch (error) {
      console.log("error--in get all orders of auth user---", error);
      throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getOrdersByStatus(status: string): Promise<OrderEntity[]> {
    try {

      let result: OrderEntity[];

      if (status === 'all') {
        result = await this.ordersRepository.find({ relations: ['user', 'orderItems'], order: { created_at: 'DESC' } });
      } else {
        result = await this.ordersRepository.find({ where: { status }, relations: ['user', 'orderItems'], order: { created_at: 'DESC' } });
      }

      if (!result || result.length === 0) {
        throw new ServiceHandler("No orders found", HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      console.log("error--in get all orders of auth user---", error);
      throw new ServiceHandler(error.message, error.status);
    }
  }

  public async getOrderItemsByUserId(userId: number): Promise<any> {
    try {
      const result = await this.ordersRepository.find({
        where: { user: { id: userId } },
        relations: ["orderItems", "orderItems.variant"]
      });
      return {
        statusCode: 200,
        result
      };
    } catch (error) {
      console.log("error--in get all orders of auth user---", error);
      throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAll(): Promise<OrderEntity[]> {
    return this.ordersRepository.find({ relations: ['user', 'orderItems'], order: { created_at: 'DESC' } });
  }

  public async sendOrderWithEmail(order: OrderEntity, items: OrderItemEntity[], userAddress: any): Promise<any> {

    const printer = new PdfPrinter({
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    })

    const transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      host: this.configService.get<string>('EMAIL_HOST'),
      port: parseInt(this.configService.get<string>('EMAIL_PORT')),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const itemTableBody = [
      ['Product', 'Quantity', 'Unit Price', 'Price'], // header
      ...items.map(item => [
        `${item.variant.product.title} (${item.color})`,
        item.quantity.toString(),
        `£${item.price.toFixed(2)}`,
        `£${(item.quantity * item.price).toFixed(2)}`
      ])
    ];

    const vat = order.total_price * 0.2;
    const total = order.total_price + vat;


    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Quote Summary', style: 'header' },
        {
          columns: [
            {
              width: '33%',
              text: [
                { text: `Customer Name:${userAddress.firstname} ${userAddress.lastname}\n`, bold: true },
                { text: `Customer Email: ${userAddress.email}\n` },
                { text: `Customer Phone: ${userAddress.phone}\n` },
              ]
            },
            {
              width: '33%',
              text: [
                { text: 'Delivery Address:\n', bold: true },
                { text: `Country: ${userAddress.country}\n` },
                { text: `Town: ${userAddress.town}\n` },
                { text: `Zipcode: ${userAddress.zipCode}\n` },
                { text: `Unit: ${userAddress.appartment}\n` }
              ]
            },
            {
              width: '33%',
              text: [
                { text: 'Date:\n', bold: true },
                { text: new Date(order.created_at).toLocaleDateString() }
              ]
            }
          ]
        },
        { text: '\nOrder Summary', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: itemTableBody,
          },
          layout: 'lightHorizontalLines'
        },
        { text: `\nTotal Net: £${order.total_price.toFixed(2)}`, margin: [10, 0, 10, 0] },
        { text: `Total VAT(20 %): £${vat.toFixed(2)}`, margin: [10, 0, 10, 0] },
        { text: `Total Amount: £${total.toFixed(2)}`, bold: true, margin: [10, 0, 10, 0] },
        {
          text: '\nIf you have any questions, feel free to contact us.\n\nBest regards,\nLondon Glass Fittings',
          style: 'footer'
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 15, bold: true, margin: [0, 10, 0, 5] },
        footer: { fontSize: 10, margin: [0, 20, 0, 0] }
      }
    };

    const chunks: any[] = [];
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.on('data', chunk => chunks.push(chunk));

    pdfDoc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);

      await transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: this.configService.get<string>('EMAIL_USER'),
        subject: 'New Order',
        html: '<p>Thank you for your order! Please find the receipt attached as a PDF.</p>',
        attachments: [
          {
            filename: `order - ${order.id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });
    });

    pdfDoc.end();

  }
}