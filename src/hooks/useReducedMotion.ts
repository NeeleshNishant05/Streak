import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Mirrors the OS "Reduce motion" setting so decorative loops can be turned off.
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (!cancelled) setReducedMotion(enabled);
      })
      .catch(() => {
        // Keep the default (animations on) if the setting can't be read.
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
