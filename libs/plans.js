export default [
  {
    order: 0,
    name: "Free",
    priceId: process.env.STRIPE_FREE_SUBSCRIPTION_PRICE_ID,
    maxSecrets: process.env.STRIPE_FREE_MAX_MONTHLY_SECRETS
      ? parseInt(process.env.STRIPE_FREE_MAX_MONTHLY_SECRETS, 10)
      : 0,
  },
  {
    order: 1,
    name: "Solo Monthly",
    priceId: process.env.STRIPE_SOLO_SUBSCRIPTION_PRICE_ID,
    maxSecrets: process.env.STRIPE_SOLO_MAX_MONTHLY_SECRETS
      ? parseInt(process.env.STRIPE_SOLO_MAX_MONTHLY_SECRETS, 10)
      : 0,
  },
  {
    order: 2,
    name: "Pro Monthly",
    priceId: process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID,
    maxSecrets: process.env.STRIPE_PRO_MAX_MONTHLY_SECRETS
      ? parseInt(process.env.STRIPE_PRO_MAX_MONTHLY_SECRETS, 10)
      : 0,
  },
];
