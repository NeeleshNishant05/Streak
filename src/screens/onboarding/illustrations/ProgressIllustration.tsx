import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { GradientBorder } from '../../../components/GradientBorder';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { colors, gradients, radius, spacing, typography } from '../../../theme';
import { IllustrationProps } from './types';

const BARS = [
  { day: 'M', height: 0.45 },
  { day: 'T', height: 0.6 },
  { day: 'W', height: 0.5 },
  { day: 'T', height: 0.75 },
  { day: 'F', height: 0.65 },
  { day: 'S', height: 0.9 },
  { day: 'S', height: 1 },
];

const CHART_HEIGHT = 120;
const MIN_SCALE = 0.08;

// A week of bars growing one after another, then settling back down and repeating.
export function ProgressIllustration({ isActive }: IllustrationProps) {
  const reducedMotion = useReducedMotion();
  const growth = useRef(BARS.map(() => new Animated.Value(MIN_SCALE))).current;

  useEffect(() => {
    if (!isActive || reducedMotion) {
      growth.forEach(bar => bar.setValue(reducedMotion ? 1 : MIN_SCALE));
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(250),
        Animated.stagger(
          90,
          growth.map(bar =>
            Animated.timing(bar, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.back(1.4)),
              useNativeDriver: true,
            }),
          ),
        ),
        Animated.delay(1400),
        Animated.parallel(
          growth.map(bar =>
            Animated.timing(bar, {
              toValue: MIN_SCALE,
              duration: 350,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ),
        ),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [growth, isActive, reducedMotion]);

  return (
    <GradientBorder
      gradient={gradients.subtleBorder}
      radius={radius.lg}
      contentStyle={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>This week</Text>
        <View style={styles.trend}>
          <Ionicons name="trending-up" size={14} color={colors.success} />
          <Text style={styles.trendText}>Up 18%</Text>
        </View>
      </View>

      <View style={styles.chart}>
        {BARS.map((bar, index) => (
          <View key={index} style={styles.column}>
            <View style={styles.barSlot}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: CHART_HEIGHT * bar.height,
                    transform: [{ scaleY: growth[index] }],
                  },
                ]}
              >
                <LinearGradient
                  colors={gradients.ember}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.dayLabel}>{bar.day}</Text>
          </View>
        ))}
      </View>
    </GradientBorder>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.label,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendText: {
    ...typography.caption,
    color: colors.success,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  barSlot: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 22,
    borderRadius: radius.sm / 2,
    overflow: 'hidden',
    // Grow from the bottom edge instead of the centre.
    transformOrigin: 'bottom',
  },
  dayLabel: {
    ...typography.caption,
  },
});
