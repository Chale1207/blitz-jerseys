type JerseyArtProps = {
  primaryColor: string;
  secondaryColor: string;
  initials: string;
  number?: number;
  className?: string;
};

/**
 * Original, generated jersey illustration — not a photo or scan of any real
 * kit. Colors/initials are data-driven so this doubles as the product photo
 * placeholder until real (licensed) photography is dropped in.
 */
export function JerseyArt({
  primaryColor,
  secondaryColor,
  initials,
  number,
  className,
}: JerseyArtProps) {
  const trimColor =
    isLight(primaryColor) && isLight(secondaryColor) ? "#1a2624" : secondaryColor;
  const badgeTextColor = isLight(primaryColor) ? trimColor : primaryColor;

  return (
    <svg
      viewBox="0 0 240 280"
      role="img"
      aria-label={`${initials} jersey`}
      className={className}
    >
      <polygon
        points="80,40 100,30 140,30 160,40 170,70 175,260 175,270 65,270 65,260 70,70"
        fill={primaryColor}
      />
      <polygon
        points="160,40 215,55 205,100 170,70"
        fill={primaryColor}
      />
      <polygon points="80,40 25,55 35,100 70,70" fill={primaryColor} />

      {/* sleeve cuffs */}
      <polygon points="205,92 215,55 221,58 210,96" fill={trimColor} />
      <polygon points="35,92 25,55 19,58 30,96" fill={trimColor} />

      {/* side seam trims */}
      <rect x="66" y="72" width="5" height="186" fill={trimColor} />
      <rect x="169" y="72" width="5" height="186" fill={trimColor} />

      {/* collar */}
      <path
        d="M100,30 Q120,46 140,30"
        stroke={trimColor}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />

      {/* chest badge */}
      <circle
        cx="93"
        cy="88"
        r="15"
        fill="#ffffff"
        stroke={trimColor}
        strokeWidth={2}
      />
      <text
        x="93"
        y="93"
        textAnchor="middle"
        fontSize="11"
        fontWeight={700}
        fill={badgeTextColor}
      >
        {initials}
      </text>

      {number ? (
        <text
          x="120"
          y="200"
          textAnchor="middle"
          fontSize="72"
          fontWeight={700}
          fill={trimColor}
          fillOpacity={0.92}
          fontFamily="var(--font-display)"
        >
          {number}
        </text>
      ) : null}
    </svg>
  );
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.75;
}
