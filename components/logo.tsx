export function NetworkLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6B46C1", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#0066FF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#00E5FF", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Network nodes */}
      <circle cx="100" cy="30" r="8" fill="url(#networkGradient)" />
      <circle cx="50" cy="60" r="8" fill="url(#networkGradient)" />
      <circle cx="150" cy="60" r="8" fill="url(#networkGradient)" />
      <circle cx="70" cy="100" r="8" fill="url(#networkGradient)" />
      <circle cx="100" cy="100" r="8" fill="url(#networkGradient)" />
      <circle cx="130" cy="100" r="8" fill="url(#networkGradient)" />
      <circle cx="40" cy="140" r="8" fill="url(#networkGradient)" />
      <circle cx="100" cy="140" r="8" fill="url(#networkGradient)" />
      <circle cx="160" cy="140" r="8" fill="url(#networkGradient)" />
      <circle cx="100" cy="170" r="8" fill="url(#networkGradient)" />

      {/* Network connections */}
      <g stroke="url(#networkGradient)" strokeWidth="3" opacity="0.6">
        <line x1="100" y1="30" x2="50" y2="60" />
        <line x1="100" y1="30" x2="150" y2="60" />
        <line x1="50" y1="60" x2="70" y2="100" />
        <line x1="50" y1="60" x2="100" y2="100" />
        <line x1="150" y1="60" x2="100" y2="100" />
        <line x1="150" y1="60" x2="130" y2="100" />
        <line x1="70" y1="100" x2="100" y2="100" />
        <line x1="100" y1="100" x2="130" y2="100" />
        <line x1="70" y1="100" x2="40" y2="140" />
        <line x1="70" y1="100" x2="100" y2="140" />
        <line x1="100" y1="100" x2="100" y2="140" />
        <line x1="130" y1="100" x2="100" y2="140" />
        <line x1="130" y1="100" x2="160" y2="140" />
        <line x1="40" y1="140" x2="100" y2="170" />
        <line x1="100" y1="140" x2="100" y2="170" />
        <line x1="160" y1="140" x2="100" y2="170" />
      </g>
    </svg>
  );
}
