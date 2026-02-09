import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { api, isAuthenticated } = useAuth();
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/payment/success?session_id=${sessionId}` } });
      return;
    }

    pollPaymentStatus();
  }, [sessionId, isAuthenticated]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus('failed');
      return;
    }

    try {
      const response = await api.get(`/payments/status/${sessionId}`);
      setPaymentDetails(response.data);

      if (response.data.payment_status === 'paid') {
        setStatus('success');
        return;
      } else if (response.data.status === 'expired') {
        setStatus('failed');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-[#0A0A0A] border border-[#27272A] p-8">
          {status === 'checking' && (
            <>
              <Loader2 className="w-16 h-16 text-[#CCFF00] mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-black text-white mb-2">Processing Payment</h1>
              <p className="text-[#A1A1AA]">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full bg-[#00FF66]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#00FF66]" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Payment Successful!</h1>
              <p className="text-[#A1A1AA] mb-6">
                Your enrollment has been confirmed. You can now access your course.
              </p>
              {paymentDetails && (
                <div className="bg-[#121212] p-4 mb-6 text-left">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#52525B]">Amount Paid</span>
                    <span className="text-white">${(paymentDetails.amount_total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#52525B]">Status</span>
                    <span className="text-[#00FF66]">Completed</span>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button className="w-full bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/my-courses">
                  <Button variant="outline" className="w-full border-[#27272A] text-white hover:border-[#CCFF00]">
                    View My Courses
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Payment Failed</h1>
              <p className="text-[#A1A1AA] mb-6">
                We couldn't process your payment. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Link to="/courses">
                  <Button className="w-full bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold">
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full border-[#27272A] text-white hover:border-[#CCFF00]">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
