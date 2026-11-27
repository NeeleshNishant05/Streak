import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type DetailRowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  showDivider?: boolean;
};

export function DetailRow({
  icon,
  label,
  value,
  showDivider = false,
}: DetailRowProps) {
  return (
    <View
      style={[styles.row, showDivider && styles.divider]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={18} color={colors.amber} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
  value: {
    ...typography.body,
  },
});
