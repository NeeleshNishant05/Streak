import LinearGradient from 'react-native-linear-gradient';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, gradients, radius, spacing } from '../theme';

type PageIndicatorProps = {
  count: number;
  // Horizontal scroll offset of the pager, in pixels.
  scrollX: Animated.Value;
  pageWidth: number;
};

const DOT_SIZE = 8;
const DOT_GAP = spacing.sm + 2;

// The ember dot is driven directly by the scroll offset, so it glides between
// positions while the user drags, instead of jumping when the page settles.
export function PageIndicator({
  count,
  scrollX,
  pageWidth,
}: PageIndicatorProps) {
  const lastPage = count - 1;
  const translateX = scrollX.interpolate({
    inputRange: [0, pageWidth * lastPage],
    outputRange: [0, (DOT_SIZE + DOT_GAP) * lastPage],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={styles.row}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.dot} />
      ))}
      <Animated.View
        style={[styles.activeDot, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={gradients.emberBorder}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeDot: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
