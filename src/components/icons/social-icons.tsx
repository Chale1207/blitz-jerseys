type IconProps = { className?: string };

/**
 * Minimal, original monogram glyphs used only as navigational links to our
 * social profiles — not reproductions of any platform's official logo.
 */
function Monogram({ label, className }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontWeight={700}
        fill="currentColor"
      >
        {label}
      </text>
    </svg>
  );
}

export const InstagramIcon = ({ className }: IconProps) => (
  <Monogram label="IG" className={className} />
);
export const FacebookIcon = ({ className }: IconProps) => (
  <Monogram label="FB" className={className} />
);
export const TikTokIcon = ({ className }: IconProps) => (
  <Monogram label="TT" className={className} />
);
export const XIcon = ({ className }: IconProps) => (
  <Monogram label="X" className={className} />
);
