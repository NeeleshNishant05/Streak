import { ComponentType } from 'react';

import { FlameIllustration } from './illustrations/FlameIllustration';
import { HabitsIllustration } from './illustrations/HabitsIllustration';
import { ProgressIllustration } from './illustrations/ProgressIllustration';
import { IllustrationProps } from './illustrations/types';

export type OnboardingSlideData = {
  key: string;
  title: string;
  description: string;
  Illustration: ComponentType<IllustrationProps>;
};

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    key: 'habits',
    title: 'Build habits that stick',
    description:
      'Pick a few small things to do each day and tick them off as you go. Small wins add up quickly.',
    Illustration: HabitsIllustration,
  },
  {
    key: 'streak',
    title: 'Keep your streak alive',
    description:
      'Every day you finish your habits adds one to your streak. Miss a day and it starts again from zero.',
    Illustration: FlameIllustration,
  },
  {
    key: 'progress',
    title: 'Watch your progress grow',
    description:
      'Your home screen shows today’s progress and your current streak, so you always know where you stand.',
    Illustration: ProgressIllustration,
  },
];
