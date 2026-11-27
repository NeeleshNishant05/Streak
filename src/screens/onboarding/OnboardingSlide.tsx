import { Animated, StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../../theme';
import { OnboardingSlideData } from './slides';

type OnboardingSlideProps = {
  slide: OnboardingSlideData;
  index: number;
  width: number;
  scrollX: Animated.Value;
  isActive: boolean;
};

export function OnboardingSlide({
  slide,
  index,
  width,
  scrollX,
  isActive,
}: OnboardingSlideProps) {
  const { Illustration } = slide;

  // -1 when the slide is one page to the right, 0 when centred, 1 when one page to the left.
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // The text drifts a little faster than the page and fades at the edges,
  // which gives the swipe a sense of depth without any extra libraries.
  const textStyle = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateX: scrollX.interpolate({
          inputRange,
          outputRange: [width * 0.3, 0, -width * 0.3],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const illustrationStyle = {
    transform: [
      {
        scale: scrollX.interpolate({
          inputRange,
          outputRange: [0.85, 1, 0.85],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.illustration, illustrationStyle]}>
        <Illustration isActive={isActive} />
      </Animated.View>

      <Animated.View style={[styles.text, textStyle]}>
        <Text style={styles.title} accessibilityRole="header">
          {slide.title}
        </Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.title,
  },
  description: {
    ...typography.body,
    maxWidth: 340,
  },
});
