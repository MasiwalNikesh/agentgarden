import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: '' };

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Contains lowercase
    if (/[a-z]/.test(password)) score++;

    // Contains uppercase
    if (/[A-Z]/.test(password)) score++;

    // Contains number
    if (/[0-9]/.test(password)) score++;

    // Contains special character
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { score: 1, text: 'Weak', color: 'bg-red-500' };
    } else if (score <= 4) {
      return { score: 2, text: 'Fair', color: 'bg-orange-500' };
    } else if (score <= 5) {
      return { score: 3, text: 'Good', color: 'bg-yellow-500' };
    } else {
      return { score: 4, text: 'Strong', color: 'bg-green-500' };
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= strength.score ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className={`h-1 flex-1 rounded-full ${
              level <= strength.score ? strength.color : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Password strength: <span className="font-semibold">{strength.text}</span>
      </p>
      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
        <p className={password.length >= 8 ? 'text-green-600' : ''}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </p>
        <p className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : ''}>
          {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '○'} Upper & lowercase letters
        </p>
        <p className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[0-9]/.test(password) ? '✓' : '○'} At least one number
        </p>
        <p className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Special character
        </p>
      </div>
    </div>
  );
};

export default PasswordStrength;
