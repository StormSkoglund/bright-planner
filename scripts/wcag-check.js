// WCAG contrast checker script
const path = require("path");
const tc = require(path.join(__dirname, "..", "tailwind.config.js"));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  if (h.length === 6) {
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  throw new Error("Unsupported hex: " + hex);
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(a, b) {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return +((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function getColor(pathKeys, fallback) {
  let cur =
    tc.theme && tc.theme.extend && tc.theme.extend.colors
      ? tc.theme.extend.colors
      : {};
  for (const k of pathKeys) {
    if (!cur) return fallback;
    cur = cur[k];
  }
  if (typeof cur === "string") return cur;
  if (cur && cur.DEFAULT) return cur.DEFAULT;
  return fallback;
}

const colors = {
  brand_light: getColor(["brand", "light"], "#e0f2f1"),
  brand: getColor(["brand", "DEFAULT"], "#009688"),
  brand_dark: getColor(["brand", "dark"], "#004d40"),
  accent_light: getColor(["accent", "light"], "#fff3e0"),
  accent: getColor(["accent", "DEFAULT"], "#ff9800"),
  accent_dark: getColor(["accent", "dark"], "#e65100"),
  neutral_lightest: getColor(["neutral", "lightest"], "#f5f5f5"),
  neutral_light: getColor(["neutral", "light"], "#e0e0e0"),
  neutral: getColor(["neutral", "DEFAULT"], "#9e9e9e"),
  neutral_dark: getColor(["neutral", "dark"], "#616161"),
  neutral_darkest: getColor(["neutral", "darkest"], "#212121"),
  white: "#ffffff",
  black: "#000000",
};

const pairs = [
  { fg: "neutral_darkest", bg: "white", label: "Primary text on white" },
  { fg: "neutral_dark", bg: "white", label: "Secondary text on white" },
  { fg: "white", bg: "brand", label: "White text on brand (buttons)" },
  { fg: "white", bg: "accent", label: "White text on accent (cta)" },
  {
    fg: "neutral_darkest",
    bg: "brand_light",
    label: "Dark text on brand light (cards)",
  },
  { fg: "brand_dark", bg: "brand_light", label: "Brand dark on brand light" },
  {
    fg: "accent_dark",
    bg: "accent_light",
    label: "Accent dark on accent light",
  },
  { fg: "neutral_dark", bg: "accent_light", label: "Neutral on accent light" },
];

console.log("Using colors from tailwind.config.js (fallbacks applied):");
console.table(colors);

console.log("\nContrast report:");
for (const p of pairs) {
  const fg = colors[p.fg];
  const bg = colors[p.bg];
  try {
    const ratio = contrastRatio(fg, bg);
    const passNormal = ratio >= 4.5;
    const passLarge = ratio >= 3.0;
    console.log(
      `- ${p.label}: ${fg} on ${bg} -> ratio ${ratio} : ${
        passNormal ? "PASS (4.5)" : passLarge ? "PASS for large (3.0)" : "FAIL"
      }`
    );
  } catch (err) {
    console.error(`Error computing ${p.label}:`, err.message);
  }
}

// Exit with non-zero when a critical fail occurs (normal text fail)
let anyCritical = false;
for (const p of pairs) {
  const fg = colors[p.fg];
  const bg = colors[p.bg];
  const ratio = contrastRatio(fg, bg);
  if (ratio < 4.5) anyCritical = true;
}
process.exit(anyCritical ? 1 : 0);
