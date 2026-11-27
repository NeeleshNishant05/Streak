import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { ComponentProps, Ref, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputInstance,
  TextInputProps,
  View,
} from 'react-native';

import { colors, gradients, radius, spacing, typography } from '../theme';
import { GradientBorder } from './GradientBorder';

type TextFieldProps = TextInputProps & {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  error?: string;
  // React 19 passes `ref` as a normal prop, so no forwardRef wrapper is needed.
  ref?: Ref<TextInputInstance>;
};

const INPUT_HEIGHT = 54;

export function TextField({
  label,
  icon,
  error,
  secureTextEntry,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const borderGradient = error
    ? gradients.errorBorder
    : isFocused
    ? gradients.emberBorder
    : gradients.subtleBorder;
  const iconColor = error
    ? colors.error
    : isFocused
    ? colors.amber
    : colors.textSubtle;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <GradientBorder
        gradient={borderGradient}
        radius={radius.md}
        contentStyle={styles.inputRow}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.amber}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          accessibilityLabel={label}
          onFocus={event => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecureVisible(visible => !visible)}
            hitSlop={spacing.md}
            accessibilityRole="button"
            accessibilityLabel={
              isSecureVisible ? 'Hide password' : 'Show password'
            }
          >
            <Ionicons
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSubtle}
            />
          </Pressable>
        ) : null}
      </GradientBorder>

      {error ? (
        <Text
          style={styles.error}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: INPUT_HEIGHT,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 16,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
});
