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
