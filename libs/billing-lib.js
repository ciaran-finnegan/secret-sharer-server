export function getPriceId(subscriptionName) {

  // Allows changes to Stripe Products without changing client
  // Move these to Env Variables or a table
  const businessSubscriptionPriceId  = process.env.businessSubscriptionPriceId;
  const enterpriseSubscriptionPriceId = process.env.enterpriseSubscriptionPriceId;

  if (subscriptionName === "Business") {
    return businessSubscriptionPriceId;
  }
  if (subscriptionName === "Enterprise") {
    return enterpriseSubscriptionPriceId;
  }

  // Add Error Handling  here
}

export function calculateCost(subscriptionId) {

  // Move these to Env Variables
  const businessSubscriptionMonthlyRate  = 49.00;
  const businessSubscriptionDescription  = "Business";
  const enterpriseSubscriptionMonthlyRate = 149.99;
  const enterpriseSubscriptionDescription = "Enterprise";

  if (subscriptionId === "1") {
    let sub = {
      "amount" : businessSubscriptionMonthlyRate,
      "description" : businessSubscriptionDescription
    };
    return sub;
  }
  if (subscriptionId === "2") {
    let sub = {
      "amount" : enterpriseSubscriptionMonthlyRate,
      "description" : enterpriseSubscriptionDescription
    };
    return sub;

  }
  // Add Error Handling  here
}

