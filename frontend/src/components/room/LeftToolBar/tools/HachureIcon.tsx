export function HachureIcon({ size = 20, color = "#a78bfa" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 19C6 19 7.5 15 8 12C8.5 9 9 5 9 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 19C11 19 12.5 15 13 12C13.5 9 14 5 14 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 19C16 19 17.5 15 18 12C18.5 9 19 5 19 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}