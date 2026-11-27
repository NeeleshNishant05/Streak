import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, spacing, typography } from '../../theme';

type ProgressCardProps = {
  completed: number;
  total: number;
  monthlyCompletion: number;
};

function progressMessage(remaining: number) {
  if (remaining === 0) return 'All done for today. Nice work.';
  if (remaining === 1) return 'One habit left for today.';
  return `${remaining} habits left for today.`;
}

export function ProgressCard({
  completed,
  total,
  monthlyCompletion,
}: ProgressCardProps) {
  const progress = total > 0 ? completed / total : 0;

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Today’s progress</Text>
        <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
      </View>

      <Text style={styles.count}>
        {completed} of {total} habits done
      </Text>
      <ProgressBar progress={progress} />
      <Text style={styles.message}>{progressMessage(total - completed)}</Text>

      <View style={styles.divider} />

      <View style={styles.monthRow}>
        <Text style={styles.monthLabel}>This month</Text>
        <Text style={styles.monthValue}>
          {Math.round(monthlyCompletion * 100)}% of habits done
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    ...typography.heading,
  },
  percent: {
    ...typography.heading,
    color: colors.amber,
  },
  count: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: {
    ...typography.label,
  },
  monthValue: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
