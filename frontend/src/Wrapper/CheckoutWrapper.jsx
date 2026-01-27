import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import Checkout from "../components/Checkout";

const stripePromise = loadStripe(import.meta.env.VITE_API_URL);

const CheckoutWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    )
}

export default CheckoutWrapper;