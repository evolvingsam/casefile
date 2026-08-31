import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: [
      'bg-[oklch(75%_0.18_75)] text-[oklch(8%_0.01_280)]',
      'hover:bg-[oklch(78%_0.2_75)] hover:shadow-[0_0_20px_oklch(75%_0.18_75_/_0.3)]',
      'active:scale-[0.98]',
    ].join(' '),
    secondary: [
      'bg-[var(--color-surface-3)] text-[var(--color-text-primary)]',
      'border border-[var(--color-border)]',
      'hover:border-[var(--color-amber-dim)] hover:text-[var(--color-amber)]',
      'active:scale-[0.98]',
    ].join(' '),
    ghost: [
      'text-[var(--color-text-secondary)]',
      'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
      'active:scale-[0.98]',
    ].join(' '),
    danger: [
      'bg-[oklch(52%_0.22_18_/_0.15)] text-[var(--color-crimson)]',
      'border border-[oklch(52%_0.22_18_/_0.3)]',
      'hover:bg-[oklch(52%_0.22_18_/_0.25)]',
      'active:scale-[0.98]',
    ].join(' '),
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
