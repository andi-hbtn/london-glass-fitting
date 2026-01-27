import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';


@Injectable()
export class StripeService {

    private stripe: Stripe;
    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(
            this.configService.get<string>("STRIPE_SECRET_KEY"),{}
        )
    }

    public async createPaymentIntent(amount: number) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: 'gbp',
            automatic_payment_methods: { enabled: true }
        });

        return { clientSecret: paymentIntent.client_secret }

    }
}
