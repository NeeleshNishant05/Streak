import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { ComponentProps, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { GradientBorder } from '../../../components/GradientBorder';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { colors, gradients, radius, spacing } from '../../../theme';
import { IllustrationProps } from './types';

const ROWS: {
  icon: ComponentProps<typeof Ionicons>['name'];
  titleWidth: number;
}[] = [
  { icon: 'water-outline', titleWidth: 96 },
  { icon: 'walk-outline', titleWidth: 120 },
  { icon: 'book-outline', titleWidth: 80 },
];

// A small checklist where each habit gets ticked off in turn, then resets and repeats.
export function HabitsIllustration({ isActive }: IllustrationProps) {
  const reducedMotion = useReducedMotion();
  const checks = useRef(ROWS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!isActive || reducedMotion) {
      checks.forEach(check => check.setValue(reducedMotion ? 1 : 0));
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.stagger(
          380,
          checks.map(check =>
            Animated.spring(check, {
              toValue: 1,
              friction: 5,
              tension: 120,
              useNativeDriver: true,
            }),
          ),
        ),
        Animated.delay(1300),
        Animated.parallel(
          checks.map(check =>
            Animated.timing(check, {
              toValue: 0,
              duration: 260,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ),
        ),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [checks, isActive, reducedMotion]);

  return (
    <GradientBorder
      gradient={gradients.subtleBorder}
      radius={radius.lg}
      contentStyle={styles.card}
    >
      {ROWS.map((row, index) => {
        const check = checks[index];
        return (
          <View key={row.icon} style={styles.row}>
            <View style={styles.iconTile}>
              <Ionicons name={row.icon} size={20} color={colors.amber} />
            </View>

            <View style={styles.lines}>
              <View style={[styles.line, { width: row.titleWidth }]} />
              <View style={[styles.line, styles.lineShort]} />
            </View>

            <View style={styles.checkbox}>
              <Animated.View
                style={[
                  styles.checkFill,
                  { opacity: check, transform: [{ scale: check }] },
                ]}
              >
                <LinearGradient
                  colors={gradients.ember}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="checkmark" size={18} color={colors.night} />
              </Animated.View>
            </View>
          </View>
        );
      })}
    </GradientBorder>
  );
}

const CHECK_SIZE = 30;

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lines: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  lineShort: {
    width: 56,
    backgroundColor: colors.track,
  },
  checkbox: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  checkFill: {
    position: 'absolute',
    top: -1.5,
    left: -1.5,
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
