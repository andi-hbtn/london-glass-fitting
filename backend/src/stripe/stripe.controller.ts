import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { HttpStatus } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService) { }

    @Post('create-payment-intent')
    public async createPaymentIntent(@Body('amount') amount: number) {
        try {
            return this.stripeService.createPaymentIntent(amount)
        } catch (error) {
            console.log("error in create-payment-intent");
            throw new ServiceHandler(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
