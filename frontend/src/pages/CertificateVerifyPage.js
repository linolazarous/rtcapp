import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Award,
  User,
  BookOpen,
  Calendar,
  Loader2
} from 'lucide-react';
import { formatDate } from '../lib/utils';

const CertificateVerifyPage = () => {
  const { api } = useAuth();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateNumber.trim()) {
      toast.error('Please enter a certificate number');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.get(`/certificates/verify/${certificateNumber.trim()}`);
      setResult(response.data);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-[#CCFF00]/10 flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-[#CCFF00]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Certificate <span className="gradient-text">Verification</span>
          </h1>
          <p className="text-[#A1A1AA] max-w-lg mx-auto">
            Verify the authenticity of a Right Tech Centre certificate by entering the certificate number below
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-[#27272A] p-8 mb-8"
        >
          <form onSubmit={handleVerify} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
              <Input
                type="text"
                placeholder="Enter certificate number (e.g., RTC-2025-XXXXXXXX)"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                className="pl-12 bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12"
                data-testid="certificate-input"
              />
            </div>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold px-8"
              data-testid="verify-btn"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
            </Button>
          </form>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-[#27272A] p-8"
          >
            {result.valid ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#00FF66]/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#00FF66]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Certificate Verified</h2>
                    <p className="text-[#00FF66] text-sm">This certificate is authentic</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Recipient</p>
                        <p className="text-white font-medium">{result.certificate.user_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Program</p>
                        <p className="text-white font-medium">{result.certificate.course_title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Credit Hours</p>
                        <p className="text-white font-medium">{result.certificate.credit_hours} Hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Issue Date</p>
                        <p className="text-white font-medium">{formatDate(result.certificate.issued_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#27272A]">
                  <p className="text-xs text-[#52525B] uppercase tracking-wider mb-2">Certificate Number</p>
                  <p className="text-[#CCFF00] font-mono">{result.certificate.certificate_number}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Certificate Not Found</h2>
                <p className="text-[#A1A1AA]">
                  The certificate number you entered could not be verified. Please check the number and try again.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#52525B]">
            Certificate numbers follow the format: RTC-YYYY-XXXXXXXX
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
