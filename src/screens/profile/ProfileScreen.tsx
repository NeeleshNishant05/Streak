import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '../../components/AppButton';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { PROFILE_DETAILS } from '../../data/mockData';
import { colors, spacing, typography } from '../../theme';
import { DetailRow } from './DetailRow';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  // The tabs only exist while signed in, so this guard is for TypeScript's benefit.
  if (!user) return null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title} accessibilityRole="header">
        Profile
      </Text>

      <View style={styles.identity}>
        <Avatar name={user.name} />
        <View style={styles.identityText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <Card style={styles.details}>
        {PROFILE_DETAILS.map((detail, index) => (
          <DetailRow
            key={detail.id}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
            showDivider={index < PROFILE_DETAILS.length - 1}
          />
        ))}
      </Card>

      <AppButton
        title="Log out"
        icon="log-out-outline"
        variant="outline"
        onPress={signOut}
      />
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
    gap: spacing.xl,
  },
  title: {
    ...typography.title,
  },
  identity: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  identityText: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  email: {
    ...typography.body,
  },
  details: {
    paddingVertical: spacing.xs,
  },
});
