export function Tricolor({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-1 w-full ${className}`} aria-hidden>
      <span className="flex-1 bg-saffron" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-india" />
    </div>
  );
}

export function SwissCross({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="3" fill="#DA291C" />
      <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" fill="#fff" />
    </svg>
  );
}
