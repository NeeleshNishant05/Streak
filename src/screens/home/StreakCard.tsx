import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { colors, gradients, radius, spacing, typography } from '../../theme';
import { WeekDay } from '../../utils/date';

type StreakCardProps = {
  currentStreak: number;
  bestStreak: number;
  week: WeekDay[];
  isTodayComplete: boolean;
};

export function StreakCard({
  currentStreak,
  bestStreak,
  week,
  isTodayComplete,
}: StreakCardProps) {
  return (
    <Card highlighted>
      <View style={styles.top}>
        <LinearGradient
          colors={gradients.ember}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.flame}
        >
          <Ionicons name="flame" size={30} color={colors.night} />
        </LinearGradient>

        <View style={styles.summary}>
          <Text
            style={styles.count}
            accessibilityLabel={`Current streak: ${currentStreak} days`}
          >
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </Text>
          <Text style={styles.caption}>
            {isTodayComplete
              ? 'Today counts. See you tomorrow.'
              : 'Finish today’s habits to keep it going.'}
          </Text>
        </View>

        <View style={styles.best}>
          <Text style={styles.bestValue}>{bestStreak}</Text>
          <Text style={styles.caption}>Best</Text>
        </View>
      </View>

      <View style={styles.week} accessibilityLabel="Last seven days">
        {week.map(day => {
          const isDone = !day.isToday || isTodayComplete;
          return (
            <View key={day.key} style={styles.day}>
              <View
                style={[
                  styles.dot,
                  isDone && styles.dotDone,
                  day.isToday && !isDone && styles.dotToday,
                ]}
              >
                {isDone ? (
                  <Ionicons name="flame" size={14} color={colors.night} />
                ) : null}
              </View>
              <Text
                style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const DOT_SIZE = 30;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flame: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    flex: 1,
    gap: 2,
  },
  count: {
    ...typography.title,
  },
  caption: {
    ...typography.caption,
  },
  best: {
    alignItems: 'center',
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  bestValue: {
    ...typography.heading,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  day: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.track,
  },
  dotDone: {
    backgroundColor: colors.amber,
  },
  dotToday: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.amber,
    borderStyle: 'dashed',
  },
  dayLabel: {
    ...typography.caption,
  },
  dayLabelToday: {
    color: colors.text,
    fontWeight: '700',
  },
});
