import Stripe from "stripe";

const stripe = Stripe(process.env.stripeSecretKey);

export default stripe;
