export type ThemeColors = {
  bg: string;
  surface: string;
  elevated: string;
  text: string;
  secondary: string;
  muted: string;
  border: string;
  accent: string;
  accentDim: string;
  danger: string;
  dangerBg: string;
  archiveBg: string;
  archive: string;
  invert: string;
  invertText: string;
  overdue: string;
};

export const darkColors: ThemeColors = {
  bg: '#000000',
  surface: '#0C0C0C',
  elevated: '#141414',
  text: '#FFFFFF',
  secondary: '#888888',
  muted: '#555555',
  border: '#222222',
  accent: '#8BA4C7',
  accentDim: 'rgba(139, 164, 199, 0.16)',
  danger: '#C45C5C',
  dangerBg: '#2A1616',
  archiveBg: '#1A1F2A',
  archive: '#8BA4C7',
  invert: '#FFFFFF',
  invertText: '#000000',
  overdue: '#D97777',
};

export const lightColors: ThemeColors = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  text: '#111111',
  secondary: '#666666',
  muted: '#999999',
  border: '#EAEAEA',
  accent: '#5B7FA6',
  accentDim: 'rgba(91, 127, 166, 0.12)',
  danger: '#C45C5C',
  dangerBg: '#F8EAEA',
  archiveBg: '#EAF0F7',
  archive: '#5B7FA6',
  invert: '#111111',
  invertText: '#FFFFFF',
  overdue: '#C45C5C',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
} as const;

export const CATEGORY_ACCENTS = [
  '#8BA4C7',
  '#7BAF98',
  '#C4A574',
  '#B088B0',
  '#7A9EAE',
  '#C48B8B',
] as const;
