interface DanerLogoProps {
  className?: string;
  size?: number;
}

export function DanerLogo({ className = "", size = 32 }: DanerLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base geometric structure (MySQL-inspired) */}
      <g>
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        {/* Inner organic shapes (MongoDB-inspired leaves) */}
        {/* Left leaf */}
        <path
          d="M 35 50 Q 30 35, 42 25 Q 45 30, 43 40 Q 42 45, 35 50 Z"
          fill="url(#gradient2)"
          opacity="0.85"
        />
        
        {/* Center leaf (main) */}
        <path
          d="M 50 20 Q 48 25, 48 35 L 48 55 Q 48 60, 50 65 Q 52 60, 52 55 L 52 35 Q 52 25, 50 20 Z"
          fill="url(#gradient3)"
        />
        
        {/* Right leaf */}
        <path
          d="M 65 50 Q 70 35, 58 25 Q 55 30, 57 40 Q 58 45, 65 50 Z"
          fill="url(#gradient2)"
          opacity="0.85"
        />
        
        {/* Data dots (geometric elements) */}
        <circle cx="35" cy="60" r="3" fill="url(#gradient3)" opacity="0.8" />
        <circle cx="50" cy="70" r="4" fill="url(#gradient3)" />
        <circle cx="65" cy="60" r="3" fill="url(#gradient3)" opacity="0.8" />
        
        {/* Center core */}
        <ellipse
          cx="50"
          cy="42"
          rx="8"
          ry="12"
          fill="url(#gradient4)"
        />
        
        {/* Shine effect */}
        <ellipse
          cx="50"
          cy="38"
          rx="3"
          ry="5"
          fill="white"
          opacity="0.3"
        />
      </g>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        
        <linearGradient id="gradient3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        
        <radialGradient id="gradient4" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </radialGradient>
      </defs>
    </svg>
  );
}
