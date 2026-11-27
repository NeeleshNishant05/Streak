import LinearGradient from 'react-native-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { colors, GradientColors, gradients, radius as radii } from '../theme';

type GradientBorderProps = {
  children: ReactNode;
  gradient?: GradientColors;
  borderWidth?: number;
  radius?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

// React Native borders can't be gradients, so we draw a gradient view and lay an
// opaque inner view on top, inset by the border width. The visible ring is the border.
export function GradientBorder({
  children,
  gradient = gradients.emberBorder,
  borderWidth = 1.5,
  radius = radii.md,
  backgroundColor = colors.surface,
  style,
  contentStyle,
}: GradientBorderProps) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radius, padding: borderWidth }, style]}
    >
      <View
        style={[
          { borderRadius: radius - borderWidth, backgroundColor },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}
