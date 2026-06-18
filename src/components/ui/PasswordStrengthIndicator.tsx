'use client';

import React, { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
}

function getPasswordStrength(password: string) {
  let strength = 0;
  if (!password) return { score: 0, label: 'Too weak', color: 'bg-red-500' };

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) {
    return { score: 1, label: 'Too weak', color: 'bg-red-500' };
  } else if (strength <= 3) {
    return { score: 2, label: 'Weak', color: 'bg-orange-500' };
  } else if (strength <= 4) {
    return { score: 3, label: 'Fair', color: 'bg-yellow-500' };
  } else if (strength <= 5) {
    return { score: 4, label: 'Good', color: 'bg-blue-500' };
  } else {
    return { score: 5, label: 'Strong', color: 'bg-green-500' };
  }
}

export function PasswordStrengthIndicator({
  password,
  showLabel = true,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength.score
                ? strength.color
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      {showLabel && password && (
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Password strength:{' '}
          <span
            className={`font-semibold ${
              strength.score === 1
                ? 'text-red-500'
                : strength.score === 2
                  ? 'text-orange-500'
                  : strength.score === 3
                    ? 'text-yellow-500'
                    : strength.score === 4
                      ? 'text-blue-500'
                      : 'text-green-500'
            }`}
          >
            {strength.label}
          </span>
        </p>
      )}
    </div>
  );
}
