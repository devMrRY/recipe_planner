export const getPlaceholderUrl = () =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f3f4f6"/>

      <g fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="145" y="85" width="110" height="90" rx="8"/>
        <circle cx="175" cy="115" r="8"/>
        <path d="M150 160l28-28 22 20 15-14 35 22"/>
      </g>

      <text
        x="200"
        y="215"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="18"
        fill="#9ca3af"
      >
        No image available
      </text>
    </svg>
  `)}`;
