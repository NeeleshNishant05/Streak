import LinearGradient from 'react-native-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { GradientColors, gradients } from '../theme';

type GradientBackgroundProps = {
  children: ReactNode;
  gradient?: GradientColors;
  style?: StyleProp<ViewStyle>;
};

export function GradientBackground({
  children,
  gradient = gradients.night,
  style,
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
