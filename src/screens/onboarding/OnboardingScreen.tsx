import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '../../components/AppButton';
import { GradientBackground } from '../../components/GradientBackground';
import { PageIndicator } from '../../components/PageIndicator';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../theme';
import { OnboardingSlide } from './OnboardingSlide';
import { ONBOARDING_SLIDES } from './slides';

const LAST_INDEX = ONBOARDING_SLIDES.length - 1;

export function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  // A ref copy lets the resize effect read the page without re-running on every swipe.
  const activeIndexRef = useRef(0);
  const isLastSlide = activeIndex === LAST_INDEX;


  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const index = Math.min(
            Math.max(Math.round(event.nativeEvent.contentOffset.x / width), 0),
            LAST_INDEX,
          );
          activeIndexRef.current = index;
          setActiveIndex(index);
        },
      }),
    [scrollX, width],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: activeIndexRef.current * width,
      animated: false,
    });
  }, [width]);

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    scrollRef.current?.scrollTo({
      x: (activeIndex + 1) * width,
      animated: true,
    });
  };

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.header}>
          {isLastSlide ? null : (
            <AppButton
              title="Skip"
              variant="text"
              onPress={completeOnboarding}
            />
          )}
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.pager}
        >
          {ONBOARDING_SLIDES.map((slide, index) => (
            <OnboardingSlide
              key={slide.key}
              slide={slide}
              index={index}
              width={width}
              scrollX={scrollX}
              isActive={index === activeIndex}
            />
          ))}
        </Animated.ScrollView>

        <View style={styles.footer}>
          <PageIndicator
            count={ONBOARDING_SLIDES.length}
            scrollX={scrollX}
            pageWidth={width}
          />
          <AppButton
            title={isLastSlide ? 'Get started' : 'Next'}
            onPress={handleNext}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  pager: {
    flex: 1,
  },
  footer: {
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
