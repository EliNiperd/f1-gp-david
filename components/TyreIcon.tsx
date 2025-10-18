export function TyreC1Hard({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
   <svg width={width} height={height} viewBox="0 0 64 64">
      {/* Borde exterior (neumático) */}
      <circle cx="32" cy="32" r="30" fill="#101010" />
      {/* Perfil de dibujo de dibujo (patrón simplificado) */}
      <g stroke="#202020" strokeWidth="2">
        <path d="M14,32 a18,18 0 0,1 36,0" fill="none" />
        <path d="M32,14 a18,18 0 0,1 0,36" fill="none" />
      </g>
      {/* Banda de color */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ffffff" strokeWidth="6" />
      {/* Identificador en texto */}
       <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ffffff">
        H
      </text>
    </svg>
  );
}

export function TyreC2Hard({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#202020" strokeWidth="2">
        <path d="M18,32 a14,14 0 0,1 28,0" fill="none" />
        <path d="M32,18 a14,14 0 0,1 0,28" fill="none" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ffffff" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ffffff">
        H
      </text>
    </svg>
  );
}

export function TyreC3Medium({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#202020" strokeWidth="2">
        <path d="M16,32 a16,16 0 0,1 32,0" fill="none" />
        <path d="M32,16 a16,16 0 0,1 0,32" fill="none" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ffe600" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ffe600">
        M
      </text>
    </svg>
  );
}

export function TyreC4Soft({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#202020" strokeWidth="2">
        <path d="M20,32 a12,12 0 0,1 24,0" fill="none" />
        <path d="M32,20 a12,12 0 0,1 0,24" fill="none" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ff1900" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ff1900">
        S
      </text>
    </svg>
  );
}

export function TyreC5Soft({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#202020" strokeWidth="2">
        <path d="M22,32 a10,10 0 0,1 20,0" fill="none" />
        <path d="M32,22 a10,10 0 0,1 0,20" fill="none" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ff1900" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ff1900">
        S
      </text>
    </svg>
  );
}

export function TyreC6Soft({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#202020" strokeWidth="2">
        <path d="M24,32 a8,8 0 0,1 16,0" fill="none" />
        <path d="M32,24 a8,8 0 0,1 0,16" fill="none" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#ff1900" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#ff1900">
        S
      </text>
    </svg>
  );
}

export function TyreIntermedium({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
     <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#006644" strokeWidth="4" strokeLinecap="round">
        {/* Líneas inclinadas para representar ranuras de lluvia */}
        <path d="M18,46 L46,18" />
        <path d="M24,46 L52,18" />
        <path d="M12,40 L40,12" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#009A3E" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#009A3E">
        I
      </text>
    </svg>
  );
}

export function TyreWet({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return (
   <svg width={width} height={height} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#101010" />
      <g stroke="#004C8C" strokeWidth="4" strokeLinecap="round">
        {/* Patrón más denso de ranuras */}
        <path d="M16,48 L48,16" />
        <path d="M20,48 L52,16" />
        <path d="M12,40 L44,8" />
        <path d="M28,48 L60,16" />
      </g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#0067b1" strokeWidth="6" />
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0067b1">
        W
      </text>
    </svg>
  );
}
