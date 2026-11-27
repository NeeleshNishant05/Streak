import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, gradients, radius, spacing } from '../theme';
import { GradientBorder } from './GradientBorder';

type CardProps = {
  children: ReactNode;
  // Highlighted cards get the ember gradient border, so the eye goes there first.
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, highlighted = false, style }: CardProps) {
  if (highlighted) {
    return (
      <GradientBorder
        gradient={gradients.emberBorder}
        radius={radius.lg}
        style={style}
        contentStyle={styles.content}
      >
        {children}
      </GradientBorder>
    );
  }

  return <View style={[styles.card, styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    padding: spacing.lg,
  },
});
