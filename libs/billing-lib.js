export function getPriceId(subscriptionName) {
  // Allows changes to Stripe Products without changing client
  // Move these to Env Variables or a table
  // const enterpriseSubscriptionPriceId =
  // process.env.enterpriseSubscriptionPriceId;

  const freeSubscriptionPriceId = process.env.freeSubscriptionPriceId;
  const soloSubscriptionPriceId = process.env.soloSubscriptionPriceId;
  const proSubscriptionPriceId = process.env.proSubscriptionPriceId;

  if (subscriptionName === "free") {
    return freeSubscriptionPriceId;
  }

  if (subscriptionName === "solo") {
    return soloSubscriptionPriceId;
  }

  if (subscriptionName === "pro") {
    return proSubscriptionPriceId;
  }

  // if (subscriptionName === "Enterprise") {
  //   return enterpriseSubscriptionPriceId;
  // }

  // Add Error Handling  here
}

export function calculateCost(subscriptionId) {
  // Move these to Env Variables
  const basicSubscriptionMonthlyRate = 4.99;
  const basicSubscriptionDescription = "Basic";
  const businessSubscriptionMonthlyRate = 49.0;
  const businessSubscriptionDescription = "Business";
  const enterpriseSubscriptionMonthlyRate = 149.99;
  const enterpriseSubscriptionDescription = "Enterprise";

  if (subscriptionId === "1") {
    let sub = {
      amount: basicSubscriptionMonthlyRate,
      description: basicSubscriptionDescription,
    };

    return sub;
  }

  if (subscriptionId === "2") {
    let sub = {
      amount: businessSubscriptionMonthlyRate,
      description: businessSubscriptionDescription,
    };

    return sub;
  }

  if (subscriptionId === "3") {
    let sub = {
      amount: enterpriseSubscriptionMonthlyRate,
      description: enterpriseSubscriptionDescription,
    };

    return sub;
  }

  // Add Error Handling  here
}
