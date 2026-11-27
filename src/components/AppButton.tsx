import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { ComponentProps, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, gradients, radius, spacing, typography } from '../theme';
import { GradientBorder } from './GradientBorder';

type ButtonVariant = 'primary' | 'outline' | 'text';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  // Background behind the outline variant, so its gradient ring looks hollow.
  surfaceColor?: string;
  style?: StyleProp<ViewStyle>;
};

const BUTTON_HEIGHT = 56;
const OUTLINE_WIDTH = 1.5;

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  surfaceColor = colors.night,
  style,
}: AppButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isInactive = disabled || loading;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const textColor = variant === 'primary' ? colors.night : colors.text;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      hitSlop={variant === 'text' ? spacing.sm : undefined}
      style={style}
    >
      <Animated.View
        style={[{ transform: [{ scale }] }, disabled && styles.disabled]}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={gradients.ember}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, styles.primaryBorder]}
          >
            {content}
          </LinearGradient>
        ) : null}

        {variant === 'outline' ? (
          <GradientBorder
            radius={radius.pill}
            borderWidth={OUTLINE_WIDTH}
            backgroundColor={surfaceColor}
            contentStyle={[styles.base, styles.outlineInner]}
          >
            {content}
          </GradientBorder>
        ) : null}

        {variant === 'text' ? (
          <View style={styles.textOnly}>{content}</View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: BUTTON_HEIGHT,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  // A light inner rim gives the filled button an edge against the gradient background.
  primaryBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  // The gradient ring sits outside the inner view, so shrink it to keep every variant 56pt tall.
  outlineInner: {
    height: BUTTON_HEIGHT - OUTLINE_WIDTH * 2,
  },
  textOnly: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.label,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
