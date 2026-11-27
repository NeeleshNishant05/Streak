import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type Habit = {
  id: string;
  title: string;
  target: string;
  icon: IconName;
  completed: boolean;
};

export const TODAYS_HABITS: Habit[] = [
  {
    id: 'water',
    title: 'Drink water',
    target: '8 glasses',
    icon: 'water-outline',
    completed: true,
  },
  {
    id: 'walk',
    title: 'Morning walk',
    target: '20 minutes',
    icon: 'walk-outline',
    completed: true,
  },
  {
    id: 'read',
    title: 'Read',
    target: '15 pages',
    icon: 'book-outline',
    completed: true,
  },
  {
    id: 'meditate',
    title: 'Meditate',
    target: '10 minutes',
    icon: 'leaf-outline',
    completed: false,
  },
  {
    id: 'journal',
    title: 'Journal',
    target: 'Before bed',
    icon: 'create-outline',
    completed: false,
  },
];

export const STREAK_STATS = {
  // Days in a row completed before today. Today joins the streak once every habit is done.
  daysBeforeToday: 12,
  bestStreak: 21,
};

export const MONTHLY_COMPLETION = 0.84;

export const PROFILE_DETAILS: {
  id: string;
  icon: IconName;
  label: string;
  value: string;
}[] = [
  {
    id: 'member',
    icon: 'calendar-outline',
    label: 'Member since',
    value: 'March 2026',
  },
  {
    id: 'reminder',
    icon: 'notifications-outline',
    label: 'Daily reminder',
    value: '8:00 PM',
  },
  {
    id: 'habits',
    icon: 'list-outline',
    label: 'Habits tracked',
    value: String(TODAYS_HABITS.length),
  },
  {
    id: 'best',
    icon: 'trophy-outline',
    label: 'Longest streak',
    value: `${STREAK_STATS.bestStreak} days`,
  },
];
