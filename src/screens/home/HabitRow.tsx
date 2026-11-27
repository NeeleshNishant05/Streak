import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Habit } from '../../data/mockData';
import { colors, gradients, radius, spacing, typography } from '../../theme';

type HabitRowProps = {
  habit: Habit;
  onToggle: (id: string) => void;
};

const CHECK_SIZE = 28;

function HabitRowBase({ habit, onToggle }: HabitRowProps) {
  const pop = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    pop.setValue(0.6);
    Animated.spring(pop, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [habit.completed, pop]);

  return (
    <Pressable
      onPress={() => onToggle(habit.id)}
      style={({ pressed }) => [
        styles.row,
        habit.completed && styles.rowDone,
        pressed && styles.pressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.completed }}
      accessibilityLabel={`${habit.title}, ${habit.target}`}
      accessibilityHint={
        habit.completed
          ? 'Marks this habit as not done'
          : 'Marks this habit as done'
      }
    >
      <View style={styles.iconTile}>
        <Ionicons
          name={habit.icon}
          size={22}
          color={habit.completed ? colors.amber : colors.textMuted}
        />
      </View>

      <View style={styles.text}>
        <Text style={[styles.title, habit.completed && styles.titleDone]}>
          {habit.title}
        </Text>
        <Text style={styles.target}>{habit.target}</Text>
      </View>

      <Animated.View style={[styles.check, { transform: [{ scale: pop }] }]}>
        {habit.completed ? (
          <LinearGradient colors={gradients.ember} style={styles.checkFill}>
            <Ionicons name="checkmark" size={18} color={colors.night} />
          </LinearGradient>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

// memo: toggling one habit re-renders only that row, because `onToggle` is a
// stable callback and the other habit objects keep the same identity.
export const HabitRow = memo(HabitRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowDone: {
    borderColor: 'rgba(255, 181, 71, 0.35)',
  },
  pressed: {
    opacity: 0.8,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.label,
    fontSize: 16,
  },
  titleDone: {
    color: colors.textMuted,
  },
  target: {
    ...typography.caption,
  },
  check: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  checkFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
