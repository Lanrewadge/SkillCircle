const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key_here');
const router = express.Router();

// Create payment intent for skill session booking
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', skillId, teacherId, sessionDuration } = req.body;

    if (!amount || !skillId || !teacherId) {
      return res.status(400).json({
        error: 'Missing required fields: amount, skillId, teacherId'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        skillId: skillId.toString(),
        teacherId: teacherId.toString(),
        sessionDuration: sessionDuration?.toString() || '60',
        userId: req.user?.id?.toString() || 'anonymous'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
});

// Confirm payment and create booking
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, skillId, teacherId, sessionDate, sessionDuration = 60 } = req.body;

    if (!paymentIntentId || !skillId || !teacherId || !sessionDate) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Retrieve payment intent to verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }

    // Create booking record in database
    const booking = {
      id: Date.now().toString(),
      userId: req.user?.id || 'anonymous',
      skillId,
      teacherId,
      sessionDate: new Date(sessionDate),
      sessionDuration,
      amount: paymentIntent.amount / 100,
      status: 'confirmed',
      paymentIntentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, save to database
    // await db.bookings.create(booking);

    res.json({
      success: true,
      booking,
      message: 'Payment confirmed and booking created'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      message: error.message
    });
  }
});

// Create subscription for premium features
router.post('/create-subscription', async (req, res) => {
  try {
    const { priceId, customerId } = req.body;

    if (!priceId) {
      return res.status(400).json({
        error: 'Price ID is required'
      });
    }

    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: req.user?.email,
        metadata: {
          userId: req.user?.id?.toString() || 'anonymous'
        }
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customerId: customer.id
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update booking status in database
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription event:', event.type, subscription.id);
      // Update user subscription status
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment history for user
router.get('/history', async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';

    // In a real app, fetch from database
    // const payments = await db.bookings.findMany({ where: { userId } });

    const mockPayments = [
      {
        id: '1',
        skillName: 'Guitar Lessons',
        teacherName: 'John Doe',
        amount: 50.00,
        date: new Date().toISOString(),
        status: 'completed'
      }
    ];

    res.json({
      payments: mockPayments,
      total: mockPayments.length
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      error: 'Failed to fetch payment history',
      message: error.message
    });
  }
});

// Get subscription status
router.get('/subscription', async (req, res) => {
  try {
    const customerId = req.query.customerId;

    if (!customerId) {
      return res.json({ subscription: null });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    const subscription = subscriptions.data[0] || null;

    res.json({
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        priceId: subscription.items.data[0]?.price.id
      } : null
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription status',
      message: error.message
    });
  }
});

module.exports = router;