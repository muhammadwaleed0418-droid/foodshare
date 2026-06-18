'use client';

import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={`
        w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95
        rounded-2xl border border-white/20 dark:border-gray-800/50
        shadow-2xl shadow-black/10 dark:shadow-black/50
        p-8 sm:p-10 lg:p-12
        transition-all duration-300 hover:shadow-2xl
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
}
