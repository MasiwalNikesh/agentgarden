/**
 * OAuth Callback Page
 * Handles OAuth redirect from backend and stores authentication token
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const { setAuthFromToken } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        // Check for errors
        if (error) {
          setStatus('error');
          setTimeout(() => {
            navigate('/login?error=' + error);
          }, 2000);
          return;
        }

        // Check for token
        if (!token) {
          setStatus('error');
          setTimeout(() => {
            navigate('/login?error=no_token');
          }, 2000);
          return;
        }

        // Store token and redirect to dashboard
        localStorage.setItem('access_token', token);

        // Update auth store
        if (setAuthFromToken) {
          await setAuthFromToken(token);
        } else {
          // Fallback - manually update store
          useAuthStore.setState({
            token: token,
            isAuthenticated: true,
            user: { provider: provider }
          });
        }

        setStatus('success');

        // Redirect to dashboard after brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=callback_failed');
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthFromToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Completing Sign In
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">
              Redirecting back to login...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OAuthCallback;
