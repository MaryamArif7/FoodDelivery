import {stripe} from "../config/stripe.js";
import Payment from "../models/Payment.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, userId, productDetails, customerEmail } =
      req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId,
        productName: productDetails?.name || "Product",
        integration: "nodejs-stripe",
      },
      receipt_email: customerEmail || null,
    });

    const payment = new Payment({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount * 100,
      currency: currency || "usd",
      status: "pending",
      productDetails,
      customerEmail,
      metadata: {
        clientIp: req.ip,
        userAgent: req.get("user-agent"),
      },
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
        amount: payment.amount,
        currency: payment.currency,
      },
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

async function handlePaymentSuccess(paymentIntent) {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    {
      status: "succeeded",
      paymentMethod: paymentIntent.payment_method_types?.[0],
    },
    { new: true }
  );

  if (payment) {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
  }
}

async function handlePaymentFailure(paymentIntent) {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    {
      status: "failed",
      errorMessage:
        paymentIntent.last_payment_error?.message || "Payment failed",
    },
    { new: true }
  );

  if (payment) {
    console.log(`Payment failed: ${paymentIntent.id}`);
  }
}

async function handlePaymentCanceled(paymentIntent) {
  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    { status: "canceled" }
  );
  console.log(`Payment canceled: ${paymentIntent.id}`);
}

async function handleRefund(charge) {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: charge.payment_intent },
    {
      status: "refunded",
      refundId: charge.refunds.data[0]?.id,
      refundAmount: charge.amount_refunded,
    }
  );
  console.log(`Refund processed: ${charge.id}`);
}

export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).select("-__v");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment status",
    });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v");

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get user payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
    });
  }
};

export const createRefund = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Only succeeded payments can be refunded",
      });
    }

    const { amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || "requested_by_customer",
    });

    payment.status = "refunded";
    payment.refundId = refund.id;
    payment.refundAmount = refund.amount;
    await payment.save();

    res.json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error("Create refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
