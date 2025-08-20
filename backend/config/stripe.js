const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'appointment_system'
      }
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    throw error;
  }
};

const createPaymentIntent = async (amount, customerId, metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        ...metadata,
        source: 'appointment_system'
      }
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
};

const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

const createCheckoutSession = async (priceId, customerId, successUrl, cancelUrl, metadata = {}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        source: 'appointment_system'
      }
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 29.99,
    stripe_price_id: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: ['Up to 100 appointments/month', 'Basic reporting', 'Email support']
  },
  professional: {
    name: 'Professional Plan',
    price: 59.99,
    stripe_price_id: 'price_professional_monthly', // Replace with actual Stripe price ID
    features: ['Up to 500 appointments/month', 'Advanced reporting', 'Priority support', 'Custom branding']
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 99.99,
    stripe_price_id: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    features: ['Unlimited appointments', 'Full reporting suite', '24/7 support', 'Custom integrations']
  }
};

module.exports = {
  stripe,
  createCustomer,
  createSubscription,
  createPaymentIntent,
  getSubscription,
  cancelSubscription,
  createCheckoutSession,
  SUBSCRIPTION_PLANS
};
