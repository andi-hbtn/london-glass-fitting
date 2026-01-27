import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/stripe`;

export const createPaymentIntent = async (amount) => {

    if (!amount || amount <= 0) {
        throw new Error("Invalid amount for payment.");
    }

    try {
        // POST tek backend service pa controller
        const amountInCents = Math.round(amount * 100);

        const { data } = await axios.post(`${url}/create-payment-intent`, { amount: amountInCents });
        if (!data?.clientSecret) {
            throw new Error("Unable to initiate payment. Stripe client secret missing.");
        }
        return data.clientSecret;
    } catch (err) {
        console.error("Stripe PaymentIntent creation failed:", err);
        throw new Error(err?.response?.data?.message || err.message || "PaymentIntent creation failed.");
    }
};

export const confirmStripePayment = async (stripe, cardNumberElement, values, clientSecret) => {

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardNumberElement,
            billing_details: {
                name: `${values.firstname} ${values.lastname}`,
                email: values.email,
                phone: values.phone,
                address: {
                    line1: values.address,
                    line2: values.appartment,
                    postal_code: values.zipCode,
                    city: values.town,
                    country: 'GB'
                }
            }
        }
    });

    if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
    }

    if (paymentResult.paymentIntent.status !== "succeeded") {
        throw new Error("Payment was not successful. Please try again.");
    }

    return paymentResult.paymentIntent;
};