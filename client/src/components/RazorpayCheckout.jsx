import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance.js';
import serverUrl from '../config/config';
import { setUserData } from '../redux/userSlice';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const RazorpayCheckout = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const amountInPaise = Math.round(parseFloat(plan.price.replace('₹', '')) * 100);
      const { data: order } = await axiosInstance.post(
        '/api/create-order',
        { amount: amountInPaise, currency: 'INR', receipt: `receipt_${plan.key}_${Date.now()}` }
      );

      if (!window.Razorpay) {
        setError('Razorpay checkout script not loaded. Please refresh.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'GenSite',
        description: `${plan.name} plan purchase`,
        order_id: order.order_id,
        handler: async function (response) {
          try {
            const { data } = await axiosInstance.post('/api/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                planName: plan.key,
                credits: plan.credits
              }
            );

            const userResult = await axiosInstance.get('/api/user/me');

            const payload = userResult.data?.user ? userResult.data.user : userResult.data;
            dispatch(setUserData(payload));
            window.alert(`Payment verified successfully. Credits added: ${data.creditsAdded}`);
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment was cancelled.');
          },
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed');
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create payment order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition ${plan.popular ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/10 hover:bg-white/20'} disabled:opacity-60`}
      >
        {loading ? 'Processing…' : plan.button}
      </button>
      {error && <p className='mt-3 text-sm text-red-400'>{error}</p>}
    </>
  );
};

export default RazorpayCheckout;
