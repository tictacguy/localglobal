// Simple, theme-appropriate flat illustrations used as placeholders in the
// onboarding / welcome slots (the original Figma raster art can be swapped in later).

export function TravelIllustration() {
  return (
    <svg className="illus" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="150" cy="110" r="92" fill="#EAF1FF" />
      <path d="M40 180h220" stroke="#D8DEE8" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 70c40-22 120-22 170 6l-18 26c-45-22-105-22-140-4L70 70Z" fill="#7FD1C9" />
      <path d="M100 76l44-10 40 12-40 10-44-12Z" fill="#B9E7E1" />
      <rect x="128" y="120" width="44" height="46" rx="8" fill="#F5A623" />
      <path d="M128 134h44" stroke="#D98B10" strokeWidth="3" />
      <rect x="146" y="112" width="8" height="12" rx="3" fill="#D98B10" />
      <circle cx="150" cy="92" r="18" fill="#3B2B2B" />
      <rect x="140" y="104" width="20" height="26" rx="8" fill="#2F6BF6" />
      <circle cx="222" cy="62" r="6" fill="#FF6B6B" />
      <circle cx="78" cy="56" r="4" fill="#2F6BF6" />
      <path d="M232 150l10-24 10 24h-20Z" fill="#2EC77A" />
    </svg>
  );
}

export function MapIllustration() {
  return (
    <svg className="illus" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="150" cy="108" r="92" fill="#EAF1FF" />
      <path d="M60 60l50 70M110 74v70M160 60v70" stroke="#CFE0FF" strokeWidth="2" />
      <rect x="70" y="60" width="120" height="86" rx="10" fill="#fff" stroke="#D8E3F8" strokeWidth="2" />
      <path d="M78 78h60M78 94h80M78 110h50M78 126h70" stroke="#C7D2E4" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 70h34M200 70l-6-6M200 70l-6 6" stroke="#1b1b1b" strokeWidth="3" strokeLinecap="round" />
      <rect x="196" y="86" width="52" height="16" rx="4" fill="#1b1b1b" />
      <text x="222" y="98" fontSize="9" fill="#fff" textAnchor="middle" fontFamily="Poppins">
        Tokyo
      </text>
      <circle cx="150" cy="150" r="16" fill="#F5A623" />
      <path d="M150 150l-8 20M150 150l8 20" stroke="#3B2B2B" strokeWidth="5" strokeLinecap="round" />
      <path d="M44 150c6 10 18 10 24 0" stroke="#2EC77A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function SuccessIllustration() {
  return (
    <svg className="illus" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="150" cy="100" r="78" fill="#EAFBF1" />
      <circle cx="150" cy="100" r="50" fill="#2ECC71" />
      <path d="M128 100l16 16 30-34" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="70" cy="56" r="5" fill="#2F6BF6" />
      <circle cx="236" cy="70" r="6" fill="#F5A623" />
      <circle cx="226" cy="140" r="4" fill="#FF6B6B" />
      <circle cx="64" cy="140" r="4" fill="#2ECC71" />
    </svg>
  );
}

export function DocIllustration() {
  return (
    <svg className="illus" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="150" cy="100" r="78" fill="#EAF1FF" />
      <rect x="110" y="56" width="80" height="100" rx="10" fill="#fff" stroke="#D8E3F8" strokeWidth="2" />
      <circle cx="150" cy="86" r="16" fill="#CFE0FF" />
      <path d="M126 128c0-12 10-18 24-18s24 6 24 18" fill="#CFE0FF" />
      <rect x="118" y="140" width="64" height="7" rx="3" fill="#E4EBF6" />
      <circle cx="196" cy="128" r="22" fill="#2F6BF6" />
      <path d="M196 120v16M188 128h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
