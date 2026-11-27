export const colors = {
  night: '#150B2E',
  plum: '#2B1255',
  violet: '#4A2180',
  surface: '#1F1342',
  surfaceRaised: '#2A1B52',

  ember: '#FF7A3D',
  amber: '#FFB547',
  rose: '#F2456E',

  text: '#FFF6EE',
  textMuted: '#BDB1D6',
  textSubtle: '#8C80AA',

  border: 'rgba(255, 255, 255, 0.12)',
  track: 'rgba(255, 255, 255, 0.1)',

  success: '#4FD69C',
  error: '#FF6B7D',
} as const;

// react-native-linear-gradient takes a plain array of colour stops.
export type GradientColors = string[];

export const gradients = {
  night: [colors.plum, '#1C0E3D', colors.night],
  ember: [colors.amber, colors.ember, colors.rose],
  emberBorder: [colors.amber, colors.rose],
  subtleBorder: ['rgba(255, 255, 255, 0.24)', 'rgba(255, 255, 255, 0.06)'],
  errorBorder: [colors.error, colors.error],
} satisfies Record<string, GradientColors>;
