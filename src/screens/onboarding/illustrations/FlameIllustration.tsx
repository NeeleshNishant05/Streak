import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { GradientBorder } from '../../../components/GradientBorder';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { colors, gradients, radius, spacing, typography } from '../../../theme';
import { IllustrationProps } from './types';

const FLAME_SIZE = 128;
const RIPPLE_DURATION_MS = 2000;

// A flickering flame with two rings rippling outward, like a pulse that keeps going.
export function FlameIllustration({ isActive }: IllustrationProps) {
  const reducedMotion = useReducedMotion();
  const flicker = useRef(new Animated.Value(0)).current;
  const ripples = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    flicker.setValue(0);
    ripples.forEach(ripple => ripple.setValue(0));
    if (!isActive || reducedMotion) return;

    const flickerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(flicker, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // The second ring starts half a cycle later, so there's always one expanding.
    const rippleLoops = ripples.map((ripple, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * (RIPPLE_DURATION_MS / 2)),
          Animated.timing(ripple, {
            toValue: 1,
            duration: RIPPLE_DURATION_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(ripple, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay((1 - index) * (RIPPLE_DURATION_MS / 2)),
        ]),
      ),
    );

    const all = Animated.parallel([flickerLoop, ...rippleLoops]);
    all.start();
    return () => all.stop();
  }, [flicker, isActive, reducedMotion, ripples]);

  const flameStyle = {
    transform: [
      {
        scale: flicker.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.07],
        }),
      },
      {
        rotate: flicker.interpolate({
          inputRange: [0, 1],
          outputRange: ['-3deg', '3deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.stage}>
        {ripples.map((ripple, index) => (
          <Animated.View
            key={index}
            style={[
              styles.ripple,
              {
                opacity: ripple.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 0],
                }),
                transform: [
                  {
                    scale: ripple.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}

        <LinearGradient
          colors={gradients.ember}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.flameCircle}
        >
          <Animated.View style={flameStyle}>
            <Ionicons
              name="flame"
              size={FLAME_SIZE * 0.55}
              color={colors.night}
            />
          </Animated.View>
        </LinearGradient>
      </View>

      <GradientBorder radius={radius.pill} contentStyle={styles.chip}>
        <Ionicons name="flame" size={16} color={colors.amber} />
        <Text style={styles.chipText}>12-day streak</Text>
      </GradientBorder>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xxl,
  },
  stage: {
    width: FLAME_SIZE * 1.9,
    height: FLAME_SIZE * 1.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: FLAME_SIZE,
    height: FLAME_SIZE,
    borderRadius: FLAME_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.ember,
  },
  flameCircle: {
    width: FLAME_SIZE,
    height: FLAME_SIZE,
    borderRadius: FLAME_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chipText: {
    ...typography.label,
  },
});
