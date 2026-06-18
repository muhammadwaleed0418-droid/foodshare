'use client';

import React, { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export function AuthInput({
  label,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full px-4 py-3 text-base font-medium
            ${icon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            bg-white dark:bg-gray-800
            border-2 border-gray-200 dark:border-gray-700
            rounded-xl transition-all duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:border-green-500 dark:focus:border-green-400
            focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20
            focus:bg-linear-to-r focus:from-green-50/50 focus:to-blue-50/50
            dark:focus:from-green-900/10 dark:focus:to-blue-900/10
            hover:border-green-300 dark:hover:border-green-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className || ''}
          `}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-in fade-in duration-200 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
