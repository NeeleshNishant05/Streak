import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, gradients, radius } from '../theme';

type ProgressBarProps = {
  // 0 to 1
  progress: number;
  height?: number;
};

export function ProgressBar({ progress, height = 10 }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const animated = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    // Width can't use the native driver, but this only runs when progress changes.
    Animated.timing(animated, {
      toValue: clamped,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [animated, clamped]);

  const width = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2 }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View style={[styles.fill, { width, borderRadius: height / 2 }]}>
        <LinearGradient
          colors={gradients.ember}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.track,
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});
