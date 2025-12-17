// Colors.ts - Centralized color management for BTS BA1 Lite simulations
// Based on Momenta color structure with support for custom client branding

export interface ColorTheme {
  // Theme configuration
  mode: 'light' | 'dark';
  useCustomColors: boolean;
  
  // Core brand colors (hex values)
  primary: string;
  secondary: string;
  
  // Neutral colors
  neutralDark: string;
  neutralLight: string;
  
  // Accent colors (mapped to BTS brand colors by default)
  accent1: string; // Teal equivalent
  accent2: string; // Purple equivalent  
  accent3: string; // Blood Orange equivalent
  accent4: string; // Blue equivalent
  accent5: string; // Custom accent
  accent6: string; // Custom accent
  
  // Semantic colors
  information: string;
  confirmation: string;
  attention: string;
  chartNegative: string;
  
  // Background and text colors (theme-dependent)
  background: string;
  backgroundSecondary: string;
  foreground: string;
  foregroundSecondary: string;
  
  // UI component colors
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // WCAG-compliant radio button colors
  radioButtonBorder: string;
  radioButtonFocus: string;
  
  // CMM Brand tints (optional - for light backgrounds)
  tintOrange?: string;
  tintMagenta?: string;
  tintCyan?: string;
  tintNavy?: string;
}

// Default BTS brand colors (WCAG AA compliant combinations)
const BTS_COLORS = {
  primary: '#24282B',     // BTS Charcoal
  secondary: '#CA1C68',   // BTS Magenta
  neutralDark: '#24282B', // BTS Charcoal
  neutralLight: '#FFFFFF',
  accent1: '#1D7279',     // BTS Teal equivalent
  accent2: '#4C3480',     // BTS Purple equivalent
  accent3: '#E63F50',     // BTS Blood Orange equivalent
  accent4: '#1C4C87',     // BTS Blue equivalent
  accent5: '#6CBBE5',     // Light blue accent
  accent6: '#EA5F84',     // Pink accent
  information: '#3665F3',
  confirmation: '#05823F',
  attention: '#7E9020',
  chartNegative: '#DC2626'  // Traditional red for negative chart values
};

// Custom client colors - CMM Palette
const CUSTOM_COLORS = {
  primary: '#FF8F1C',      // CMM Orange - primary accent
  secondary: '#E70865',    // CMM Magenta - secondary accent
  neutralDark: '#01426A',  // CMM Navy - headings / deep accent
  neutralLight: '#FFFFFF', // White background
  accent1: '#008AD8',      // CMM Cyan - link / supporting
  accent2: '#E70865',      // CMM Magenta
  accent3: '#FF8F1C',      // CMM Orange
  accent4: '#01426A',      // CMM Navy
  accent5: '#008AD8',      // CMM Cyan (repeated for flexibility)
  accent6: '#E70865',      // CMM Magenta (repeated for flexibility)
  information: '#008AD8',  // CMM Cyan for info states
  confirmation: '#05823F', // Keep existing green for success
  attention: '#FF8F1C',    // CMM Orange for warnings/attention
  chartNegative: '#DC2626' // Traditional red for negative chart values
};



// Theme configuration - Set this to configure the simulation's appearance
export const THEME_CONFIG = {
  mode: 'light' as 'light' | 'dark',
  useCustomColors: false, // Set to true to use custom client colors, false to use BTS colors
};

// Generate light theme colors with WCAG AA compliance
const generateLightTheme = (colors: typeof BTS_COLORS): ColorTheme => ({
  mode: 'light',
  useCustomColors: THEME_CONFIG.useCustomColors,
  
  // Core colors
  primary: colors.primary,
  secondary: colors.secondary,
  neutralDark: colors.neutralDark,
  neutralLight: colors.neutralLight,
  
  // Accent colors
  accent1: colors.accent1,
  accent2: colors.accent2,
  accent3: colors.accent3,
  accent4: colors.accent4,
  accent5: colors.accent5,
  accent6: colors.accent6,
  
  // Semantic colors
  information: colors.information,
  confirmation: colors.confirmation,
  attention: colors.attention,
  chartNegative: colors.chartNegative,
  
  // Light theme backgrounds and text - CMM optimized
  background: '#FFFFFF',        // CMM White background
  backgroundSecondary: '#E7EDF1', // CMM Tint Navy for secondary surfaces
  foreground: '#01426A',        // CMM Navy for primary text (WCAG AA compliant)
  foregroundSecondary: '#01426A', // CMM Navy at 70% opacity handled via CSS
  
  // UI components for light theme - CMM specific
  border: '#E7EDF1',            // CMM Tint Navy for borders
  input: '#E7EDF1',             // CMM Tint Navy for input backgrounds
  ring: '#008AD8',              // CMM Cyan for focus rings
  card: '#FFFFFF',              // White cards
  cardForeground: '#01426A',    // CMM Navy text on cards
  popover: '#FFFFFF',           // White popover
  popoverForeground: '#01426A', // CMM Navy text
  muted: '#E7EDF1',             // CMM Tint Navy for muted backgrounds
  mutedForeground: '#01426A',   // CMM Navy for muted text (reduced opacity via CSS)
  destructive: '#E70865',       // CMM Magenta for destructive actions
  destructiveForeground: '#FFFFFF', // White text on magenta
  
  // WCAG AA compliant radio buttons for light theme (4.5:1 contrast)
  radioButtonBorder: '#01426A', // CMM Navy border
  radioButtonFocus: '#008AD8',  // CMM Cyan focus
  
  // CMM Brand tints for light backgrounds/panels
  tintOrange: '#FFF2EB',        // Light orange tint
  tintMagenta: '#FDE6F0',       // Light magenta tint
  tintCyan: '#E6F3FB',          // Light cyan tint
  tintNavy: '#E7EDF1',          // Light navy tint
});

// Generate dark theme colors with WCAG AA compliance
const generateDarkTheme = (colors: typeof BTS_COLORS): ColorTheme => ({
  mode: 'dark',
  useCustomColors: THEME_CONFIG.useCustomColors,
  
  // Core colors
  primary: colors.secondary, // Use magenta as primary in dark mode
  secondary: colors.secondary,
  neutralDark: colors.neutralDark,
  neutralLight: colors.neutralLight,
  
  // Accent colors
  accent1: colors.accent1,
  accent2: colors.accent2,
  accent3: colors.accent3,
  accent4: colors.accent4,
  accent5: colors.accent5,
  accent6: colors.accent6,
  
  // Semantic colors
  information: colors.information,
  confirmation: colors.confirmation,
  attention: colors.attention,
  chartNegative: colors.chartNegative,
  
  // Dark theme backgrounds and text
  background: '#0F1419',
  backgroundSecondary: '#1A1F26',
  foreground: '#FFFFFF',
  foregroundSecondary: '#B3B3B3',
  
  // UI components for dark theme
  border: '#333333',
  input: '#1A1F26',
  ring: colors.secondary,
  card: '#1A1F26',
  cardForeground: '#FFFFFF',
  popover: '#1A1F26',
  popoverForeground: '#FFFFFF',
  muted: '#1A1F26',
  mutedForeground: '#B3B3B3',
  destructive: '#FF4757',
  destructiveForeground: '#FFFFFF',
  
  // WCAG AA compliant radio buttons for dark theme (3:1 contrast minimum)
  radioButtonBorder: '#8B8B8B',
  radioButtonFocus: '#66D9EF',
});

// Get the current theme colors
export const getCurrentTheme = (): ColorTheme => {
  const colors = THEME_CONFIG.useCustomColors ? CUSTOM_COLORS : BTS_COLORS;
  
  if (THEME_CONFIG.mode === 'light') {
    return generateLightTheme(colors);
  } else {
    return generateDarkTheme(colors);
  }
};

// Export the current theme
export const THEME_COLORS = getCurrentTheme();

// Utility function to convert hex to HSL for CSS variables
export const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;

  let h: number, s: number;

  if (diff === 0) {
    h = s = 0;
  } else {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    switch (max) {
      case r:
        h = ((g - b) / diff) + (g < b ? 6 : 0);
        break;
      case g:
        h = ((b - r) / diff) + 2;
        break;
      case b:
        h = ((r - g) / diff) + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    string: `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  };
};

// Helper function to convert key names to CSS variable format
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Dynamic color system initialization - Call this to inject theme colors
export function initializeColorTheme() {
  const theme = getCurrentTheme();
  const variables = generateCSSVariables(theme);
  
  // Inject CSS variables into document root
  const root = document.documentElement;
  
  // Parse the CSS string and inject variables
  const cssText = variables.replace(/^\s+|\s+$/gm, '').trim();
  const variableRegex = /--([^:]+):\s*([^;]+);?/g;
  let match;
  
  while ((match = variableRegex.exec(cssText)) !== null) {
    const [, property, value] = match;
    root.style.setProperty(`--${property}`, value.trim());
  }
  
  // Add accent color variables
  const accentColors = [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
  accentColors.forEach((color, index) => {
    const hsl = hexToHsl(color);
    root.style.setProperty(`--accent-${index + 1}`, hsl.string);
  });
  
  // Add theme mode class
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme.mode);
}

// Generate CSS custom properties
export const generateCSSVariables = (theme: ColorTheme) => {
  const hslToString = (color: string) => hexToHsl(color).string;
  
  return `
    --background: ${hslToString(theme.background)};
    --foreground: ${hslToString(theme.foreground)};
    --card: ${hslToString(theme.card)};
    --card-foreground: ${hslToString(theme.cardForeground)};
    --popover: ${hslToString(theme.popover)};
    --popover-foreground: ${hslToString(theme.popoverForeground)};
    --primary: ${hslToString(theme.primary)};
    --primary-foreground: ${hslToString(theme.mode === 'light' ? theme.neutralLight : theme.foreground)};
    --secondary: ${hslToString(theme.secondary)};
    --secondary-foreground: ${hslToString(theme.mode === 'light' ? theme.neutralLight : theme.foreground)};
    --muted: ${hslToString(theme.muted)};
    --muted-foreground: ${hslToString(theme.mutedForeground)};
    --accent: ${hslToString(theme.accent1)};
    --accent-foreground: ${hslToString(theme.neutralLight)};
    --destructive: ${hslToString(theme.destructive)};
    --destructive-foreground: ${hslToString(theme.destructiveForeground)};
    --border: ${hslToString(theme.border)};
    --input: ${hslToString(theme.input)};
    --ring: ${hslToString(theme.ring)};
    --radius: 0.5rem;
    
    /* Accent colors */
    --accent-1: ${hslToString(theme.accent1)};
    --accent-2: ${hslToString(theme.accent2)};
    --accent-3: ${hslToString(theme.accent3)};
    --accent-4: ${hslToString(theme.accent4)};
    --accent-5: ${hslToString(theme.accent5)};
    --accent-6: ${hslToString(theme.accent6)};
    
    /* Semantic colors */
    --color-information: ${hslToString(theme.information)};
    --color-confirmation: ${hslToString(theme.confirmation)};
    --color-attention: ${hslToString(theme.attention)};
    --chart-negative: ${hslToString(theme.chartNegative)};
    
    /* WCAG-compliant radio button colors */
    --radio-button-border: ${hslToString(theme.radioButtonBorder)};
    --radio-button-focus: ${hslToString(theme.radioButtonFocus)};
    
    /* CMM Brand tints */
    ${theme.tintOrange ? `--tint-orange: ${hslToString(theme.tintOrange)};` : ''}
    ${theme.tintMagenta ? `--tint-magenta: ${hslToString(theme.tintMagenta)};` : ''}
    ${theme.tintCyan ? `--tint-cyan: ${hslToString(theme.tintCyan)};` : ''}
    ${theme.tintNavy ? `--tint-navy: ${hslToString(theme.tintNavy)};` : ''}
  `;
};

// Export gradient configurations
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${THEME_COLORS.primary}, ${THEME_COLORS.accent1})`,
  magenta: `linear-gradient(135deg, ${THEME_COLORS.secondary}, ${THEME_COLORS.accent6})`,
  emerald: `linear-gradient(135deg, ${THEME_COLORS.accent1}, ${THEME_COLORS.confirmation})`,
  teal: `linear-gradient(135deg, ${THEME_COLORS.accent1}, ${THEME_COLORS.accent5})`,
  purple: `linear-gradient(135deg, ${THEME_COLORS.accent2}, ${THEME_COLORS.accent6})`,
  blue: `linear-gradient(135deg, ${THEME_COLORS.accent4}, ${THEME_COLORS.accent5})`,
  bloodOrange: `linear-gradient(135deg, ${THEME_COLORS.accent3}, ${THEME_COLORS.attention})`,
};