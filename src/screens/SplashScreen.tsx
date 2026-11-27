import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { FlameMark } from '../components/FlameMark';
import { GradientBackground } from '../components/GradientBackground';
import { colors, spacing, typography } from '../theme';

type SplashScreenProps = {
  onFinish: () => void;
};

const LOGO_SIZE = 104;
const HOLD_MS = 650;

const GLOW_SIZE = LOGO_SIZE * 2.6;

// Stacked discs with falling opacity fake a soft glow without a blur library.
const GLOW_LAYERS = [
  { scale: 1, opacity: 0.08 },
  { scale: 0.72, opacity: 0.12 },
  { scale: 0.5, opacity: 0.18 },
];

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const wordmark = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(wordmark, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(HOLD_MS),
    ]);

    animation.start(({ finished }) => {
      // `finished` is false if the animation was stopped by the cleanup below.
      if (finished) onFinish();
    });

    return () => animation.stop();
  }, [glow, logoOpacity, logoScale, onFinish, wordmark]);

  const glowStyle = {
    opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    transform: [
      {
        scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
      },
    ],
  };

  const wordmarkStyle = {
    opacity: wordmark,
    transform: [
      {
        translateY: wordmark.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return (
    <GradientBackground>
      <View
        style={styles.center}
        accessible
        accessibilityLabel="Streaks"
        accessibilityRole="header"
      >
        <View style={styles.logoArea}>
          <Animated.View style={[styles.glow, glowStyle]}>
            {GLOW_LAYERS.map(layer => (
              <View
                key={layer.scale}
                style={[
                  styles.glowLayer,
                  {
                    opacity: layer.opacity,
                    transform: [{ scale: layer.scale }],
                  },
                ]}
              />
            ))}
          </Animated.View>
          <Animated.View
            style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
          >
            <FlameMark size={LOGO_SIZE} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.wordmark, wordmarkStyle]}>
          <Text style={styles.name}>Streaks</Text>
          <Text style={styles.tagline}>Show up a little every day.</Text>
        </Animated.View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  logoArea: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -spacing.xxxl,
    marginTop: -spacing.xxxl,
  },
  glow: {
    ...StyleSheet.absoluteFill,
  },
  glowLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.ember,
  },
  wordmark: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.display,
  },
  tagline: {
    ...typography.body,
  },
});
