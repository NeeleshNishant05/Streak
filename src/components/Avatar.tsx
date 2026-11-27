import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, gradients } from '../theme';
import { initialsFromName } from '../utils/user';

type AvatarProps = {
  name: string;
  size?: number;
};

const RING_WIDTH = 3;

export function Avatar({ name, size = 88 }: AvatarProps) {
  const innerSize = size - RING_WIDTH * 2;

  return (
    <LinearGradient
      colors={gradients.ember}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar for ${name}`}
    >
      <View
        style={[
          styles.inner,
          { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
          {initialsFromName(name)}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.text,
    fontWeight: '800',
  },
});
