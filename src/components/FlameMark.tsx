import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';

import { colors, gradients } from '../theme';

type FlameMarkProps = {
  size?: number;
};

// The app's logo: a flame on an ember tile. Used on the splash and login screens.
export function FlameMark({ size = 96 }: FlameMarkProps) {
  return (
    <LinearGradient
      colors={gradients.ember}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.3 },
      ]}
    >
      <Ionicons name="flame" size={size * 0.56} color={colors.night} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
