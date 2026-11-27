import { TextStyle } from 'react-native';

import { colors } from './colors';

// One system typeface with a clear scale, so text looks native on both platforms
// and the splash screen doesn't have to wait for a custom font to load.
export const typography = {
  display: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.text,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.text,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: colors.textMuted,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textSubtle,
  },
} satisfies Record<string, TextStyle>;
