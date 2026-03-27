const Razorpay = require('razorpay');
const crypto = require('crypto');
const OrderModel = require('../../app/models/order-model');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ success: false, error: 'Invalid amount' });

    const options = {
      amount: Math.round(Number(amount) * 100), // convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await instance.orders.create(options);

    // Optionally persist the razorpay order id in your DB associated with a local order
    return res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature valid. Optionally update your DB order here.
      // Example (if you stored a local order by receipt or razorpay_order_id):
      // await OrderModel.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paid: true, razorpayPaymentId: razorpay_payment_id });

      return res.json({
        success: true,
        paymentInfo: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        }
        });

    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('verifyPayment error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
