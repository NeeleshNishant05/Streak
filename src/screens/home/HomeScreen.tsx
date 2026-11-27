import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import {
  Habit,
  MONTHLY_COMPLETION,
  STREAK_STATS,
  TODAYS_HABITS,
} from '../../data/mockData';
import { colors, spacing, typography } from '../../theme';
import { formatToday, getGreeting, getLastSevenDays } from '../../utils/date';
import { HabitRow } from './HabitRow';
import { ProgressCard } from './ProgressCard';
import { StreakCard } from './StreakCard';

export function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Local state so ticking a habit updates the cards. It resets on restart (no backend).
  const [habits, setHabits] = useState<Habit[]>(TODAYS_HABITS);

  const toggleHabit = useCallback((id: string) => {
    setHabits(current =>
      current.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  }, []);

  const completedCount = useMemo(
    () => habits.filter(habit => habit.completed).length,
    [habits],
  );
  const isTodayComplete = completedCount === habits.length;
  const currentStreak =
    STREAK_STATS.daysBeforeToday + (isTodayComplete ? 1 : 0);
  const bestStreak = Math.max(STREAK_STATS.bestStreak, currentStreak);

  // Calculated once per mount; the dates only change at midnight.
  const week = useMemo(() => getLastSevenDays(), []);
  const firstName = user?.name.split(' ')[0];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatToday()}</Text>
        <Text style={styles.greeting} accessibilityRole="header">
          {getGreeting()}
          {firstName ? `, ${firstName}` : ''}
        </Text>
      </View>

      <StreakCard
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        week={week}
        isTodayComplete={isTodayComplete}
      />

      <ProgressCard
        completed={completedCount}
        total={habits.length}
        monthlyCompletion={MONTHLY_COMPLETION}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Today’s habits
        </Text>
        <Text style={styles.sectionHint}>Tap to mark done</Text>
      </View>

      {habits.length > 0 ? (
        <View style={styles.list}>
          {habits.map(habit => (
            <HabitRow key={habit.id} habit={habit} onToggle={toggleHabit} />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>
          No habits planned for today. Add one to start a streak.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.night,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.caption,
  },
  greeting: {
    ...typography.title,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
  },
  sectionHint: {
    ...typography.caption,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
