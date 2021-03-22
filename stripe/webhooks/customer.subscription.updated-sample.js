{
  "object": {
    "id": "sub_J9yrgZtyXatU3c",
    "object": "subscription",
    "application_fee_percent": null,
    "billing_cycle_anchor": 1616385483,
    "billing_thresholds": null,
    "cancel_at": null,
    "cancel_at_period_end": false,
    "canceled_at": null,
    "collection_method": "charge_automatically",
    "created": 1616385483,
    "current_period_end": 1619063883,
    "current_period_start": 1616385483,
    "customer": "cus_J9yrK3PMU0s5Im",
    "days_until_due": null,
    "default_payment_method": "pm_1IXetyChF6zaLrtn0JeH2fBC",
    "default_source": null,
    "default_tax_rates": [
    ],
    "discount": null,
    "ended_at": null,
    "items": {
      "object": "list",
      "data": [
        {
          "id": "si_J9yrfaI3wVoFGp",
          "object": "subscription_item",
          "billing_thresholds": null,
          "created": 1616385483,
          "metadata": {
          },
          "plan": {
            "id": "price_1IPHBzChF6zaLrtnNew7lYwK",
            "object": "plan",
            "active": true,
            "aggregate_usage": null,
            "amount": 499,
            "amount_decimal": "499",
            "billing_scheme": "per_unit",
            "created": 1614387719,
            "currency": "usd",
            "interval": "month",
            "interval_count": 1,
            "livemode": false,
            "metadata": {
            },
            "nickname": "Solo Monthly",
            "product": "prod_J1JpFshOXkwR3V",
            "tiers_mode": null,
            "transform_usage": null,
            "trial_period_days": null,
            "usage_type": "licensed"
          },
          "price": {
            "id": "price_1IPHBzChF6zaLrtnNew7lYwK",
            "object": "price",
            "active": true,
            "billing_scheme": "per_unit",
            "created": 1614387719,
            "currency": "usd",
            "livemode": false,
            "lookup_key": null,
            "metadata": {
            },
            "nickname": "Solo Monthly",
            "product": "prod_J1JpFshOXkwR3V",
            "recurring": {
              "aggregate_usage": null,
              "interval": "month",
              "interval_count": 1,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "tiers_mode": null,
            "transform_quantity": null,
            "type": "recurring",
            "unit_amount": 499,
            "unit_amount_decimal": "499"
          },
          "quantity": 1,
          "subscription": "sub_J9yrgZtyXatU3c",
          "tax_rates": [
          ]
        }
      ],
      "has_more": false,
      "total_count": 1,
      "url": "/v1/subscription_items?subscription=sub_J9yrgZtyXatU3c"
    },
    "latest_invoice": "in_1IXetzChF6zaLrtnQjBZAqZK",
    "livemode": false,
    "metadata": {
    },
    "next_pending_invoice_item_invoice": null,
    "pause_collection": null,
    "pending_invoice_item_interval": null,
    "pending_setup_intent": null,
    "pending_update": null,
    "plan": {
      "id": "price_1IPHBzChF6zaLrtnNew7lYwK",
      "object": "plan",
      "active": true,
      "aggregate_usage": null,
      "amount": 499,
      "amount_decimal": "499",
      "billing_scheme": "per_unit",
      "created": 1614387719,
      "currency": "usd",
      "interval": "month",
      "interval_count": 1,
      "livemode": false,
      "metadata": {
      },
      "nickname": "Solo Monthly",
      "product": "prod_J1JpFshOXkwR3V",
      "tiers_mode": null,
      "transform_usage": null,
      "trial_period_days": null,
      "usage_type": "licensed"
    },
    "quantity": 1,
    "schedule": null,
    "start_date": 1616385483,
    "status": "active",
    "transfer_data": null,
    "trial_end": null,
    "trial_start": null
  },
  "previous_attributes": {
    "status": "incomplete"
  }
}