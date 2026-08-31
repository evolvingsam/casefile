interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'crimson' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'muted', className = '' }: BadgeProps) {
  const variantClass = {
    amber: 'badge-amber',
    crimson: 'badge-crimson',
    muted: 'badge-muted',
  }[variant];

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
