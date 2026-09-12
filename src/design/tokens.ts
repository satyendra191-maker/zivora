export const colors = {
  primary: {
    50: '#F0EAFB',
    100: '#E4D6FC',
    200: '#C9ACF7',
    300: '#AD82F2',
    400: '#9259ED',
    500: '#7950C9',
    600: '#6440AF',
    700: '#4D318A',
    800: '#3D266B',
    900: '#2E1E4F',
    950: '#1A0F2E',
  },
  secondary: {
    50: '#F3F0FC',
    100: '#E8E1F7',
    200: '#D1C3EE',
    300: '#B5A0E3',
    400: '#9A7DD9',
    500: '#7F5BCF',
    600: '#6A4BC0',
    700: '#543AA0',
    800: '#422E7F',
    900: '#342563',
    950: '#1D1336',
  },
  surface: {
    50: '#FAF9FC',
    100: '#F5F3FC',
    200: '#EBE7F7',
    300: '#DDD8F0',
    400: '#C9C2E5',
    500: '#B5ACDA',
    600: '#9A8FAF',
    700: '#7F728F',
    800: '#665C73',
    900: '#52485C',
    950: '#2D2238',
  },
  text: {
    primary: '#27233F',
    secondary: '#5A5475',
    tertiary: '#8D8199',
    quaternary: '#B5ACBE',
    inverse: '#FAF9FC',
    link: '#6440AF',
    linkHover: '#4D318A',
  },
  border: {
    light: '#EAE7EF',
    default: '#D9D2E3',
    strong: '#C9C2E5',
    focus: '#7950C9',
    error: '#E07B9A',
  },
  semantic: {
    success: {
      light: '#E7F2EC',
      default: '#3C7A5C',
      dark: '#2D5E46',
      surface: '#E7F2EC',
    },
    warning: {
      light: '#FAF0DC',
      default: '#9A6B1E',
      dark: '#7A5216',
      surface: '#FAF0DC',
    },
    error: {
      light: '#F9E9EE',
      default: '#B0576B',
      dark: '#8A4252',
      surface: '#F9E9EE',
    },
    info: {
      light: '#F0EAFB',
      default: '#6440AF',
      dark: '#4D318A',
      surface: '#F0EAFB',
    },
  },
  brand: {
    purple: '#7950C9',
    purpleDark: '#6440AF',
    purpleLight: '#F0EAFB',
    ink: '#27233F',
    muted: '#918C9B',
    green: '#488D72',
    coral: '#E8A13D',
  },
  overlay: {
    backdrop: 'rgba(38, 28, 58, 0.4)',
    modal: 'rgba(38, 22, 63, 0.35)',
    scrim: 'rgba(22, 16, 47, 0.5)',
  },
  shadow: {
    xs: '0 1px 2px rgba(40, 22, 63, 0.05)',
    sm: '0 2px 8px rgba(40, 22, 63, 0.08)',
    md: '0 4px 16px rgba(40, 22, 63, 0.1)',
    lg: '0 8px 32px rgba(40, 22, 63, 0.12)',
    xl: '0 20px 64px rgba(40, 22, 63, 0.15)',
    inner: 'inset 0 2px 4px rgba(40, 22, 63, 0.06)',
    focus: '0 0 0 3px rgba(121, 80, 201, 0.18)',
  },
} as const;

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
} as const;

export const radius = {
  none: '0',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '14px',
  '3xl': '16px',
  '4xl': '24px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    heading: ['Satoshi', 'Manrope', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Space Grotesk', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    ui: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['11px', { lineHeight: '1.45', letterSpacing: '0.01em' }],
    sm: ['12px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
    base: ['13px', { lineHeight: '1.55', letterSpacing: '0.005em' }],
    lg: ['14px', { lineHeight: '1.6', letterSpacing: '0' }],
    xl: ['15px', { lineHeight: '1.6', letterSpacing: '0' }],
    '2xl': ['17px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
    '3xl': ['21px', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
    '4xl': ['26px', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
    '5xl': ['31px', { lineHeight: '1.3', letterSpacing: '-0.03em' }],
    '6xl': ['38px', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
    '7xl': ['48px', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
  },
  fontWeight: {
    normal: 400,
    medium: 450,
    semibold: 550,
    bold: 600,
    extrabold: 650,
    black: 700,
    heavy: 800,
  },
  letterSpacing: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
    widest: '0.13em',
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export const shadows = {
  none: 'none',
  xs: colors.shadow.xs,
  sm: colors.shadow.sm,
  md: colors.shadow.md,
  lg: colors.shadow.lg,
  xl: colors.shadow.xl,
  inner: colors.shadow.inner,
  focus: colors.shadow.focus,
  card: '0 2px 14px rgba(40, 22, 63, 0.08)',
  cardHover: '0 4px 24px rgba(40, 22, 63, 0.12)',
  modal: '0 20px 100px rgba(40, 22, 63, 0.19)',
  dropdown: '0 8px 32px rgba(40, 22, 63, 0.12)',
  tooltip: '0 4px 16px rgba(40, 22, 63, 0.1)',
} as const;

export const transitions = {
  fast: '120ms ease',
  base: '180ms ease',
  slow: '250ms ease',
  slower: '350ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1600px',
  full: '100%',
} as const;

export const iconSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
} as const;

export const avatarSizes = {
  xs: '24px',
  sm: '32px',
  md: '36px',
  lg: '40px',
  xl: '46px',
  '2xl': '56px',
  '3xl': '72px',
  '4xl': '96px',
} as const;

export const density = {
  compact: {
    spacing: spacing[2],
    padding: spacing[2],
    gap: spacing[1],
    fontSize: typography.fontSize.xs,
    iconSize: iconSizes.xs,
  },
  comfortable: {
    spacing: spacing[3],
    padding: spacing[3],
    gap: spacing[2],
    fontSize: typography.fontSize.sm,
    iconSize: iconSizes.sm,
  },
  spacious: {
    spacing: spacing[4],
    padding: spacing[4],
    gap: spacing[3],
    fontSize: typography.fontSize.base,
    iconSize: iconSizes.md,
  },
} as const;

export const motion = {
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
  durations: {
    instant: '0ms',
    fast: '120ms',
    normal: '180ms',
    slow: '250ms',
    slower: '350ms',
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const focus = {
  ring: '0 0 0 3px rgba(121, 80, 201, 0.18)',
  ringOffset: '2px',
  outline: '2px solid #7950C9',
  outlineOffset: '2px',
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  container,
  iconSizes,
  avatarSizes,
  density,
  motion,
  focus,
} as const;

export type Tokens = typeof tokens;
export type ColorScale = keyof typeof colors.primary;
export type SpacingScale = keyof typeof spacing;
export type RadiusScale = keyof typeof radius;
export type FontSizeScale = keyof typeof typography.fontSize;
export type ShadowScale = keyof typeof shadows;
export type TransitionScale = keyof typeof transitions;
export type ZIndexScale = keyof typeof zIndex;
export type BreakpointScale = keyof typeof breakpoints;