import Razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import User from '../models/user.model.js';

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise' });
    }

    const options = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await Razorpay.orders.create(options);

    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return res.status(401).json({ message: 'Razorpay authentication failed' });
    }
    return res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: 'Missing payment verification fields' });
//     }

//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: 'Invalid payment signature' });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: 'User authentication required' });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const creditsToAdd = Math.round((amount || 0) / 100);
//     user.credits += creditsToAdd;
//     await user.save();

//     return res.status(200).json({
//       message: 'Payment verified successfully',
//       creditsAdded: creditsToAdd,
//       currentCredits: user.credits,
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Payment verification failed', error: error.message });
//   }
// };

export const verifyPayment = async (req, res) => {
  try {
    // 1. Grab the exact plan name and credits from the frontend
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        planName, 
        credits 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Add whatever credits the frontend sends
    if (credits) {
        user.credits += Number(credits);
    }
    
    // 3. Update to whatever plan the frontend sends
    if (planName) {
        user.plan = planName;
    }
    
    await user.save();

    console.log(`Success! Upgraded to ${planName} and added ${credits} credits.`);

    return res.status(200).json({
      message: 'Payment verified successfully',
      creditsAdded: credits,
      currentCredits: user.credits,
      plan: user.plan
    });
  } catch (error) {
    console.log("Verification Crash Error:", error);
    return res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};