'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function AuthButton({
  children,
  isLoading,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = true,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-green-500 to-green-600
      dark:from-green-600 dark:to-green-700
      text-white
      hover:from-green-600 hover:to-green-700
      dark:hover:from-green-700 dark:hover:to-green-800
      focus:ring-green-500 dark:focus:ring-green-400
      shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-cyan-500
      dark:from-blue-600 dark:to-cyan-600
      text-white
      hover:from-blue-600 hover:to-cyan-600
      dark:hover:from-blue-700 dark:hover:to-cyan-700
      focus:ring-blue-500 dark:focus:ring-blue-400
      shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
    `,
    outline: `
      border-2 border-green-500 dark:border-green-400
      text-green-600 dark:text-green-400
      bg-white dark:bg-gray-900
      hover:bg-green-50 dark:hover:bg-green-900/20
      focus:ring-green-500 dark:focus:ring-green-400
    `,
    ghost: `
      text-gray-600 dark:text-gray-400
      hover:text-gray-900 dark:hover:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:ring-gray-500 dark:focus:ring-gray-400
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className || ''}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
