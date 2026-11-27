import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInputInstance,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '../components/AppButton';
import { FlameMark } from '../components/FlameMark';
import { GradientBackground } from '../components/GradientBackground';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme';
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validatePassword,
} from '../utils/validation';

type Field = 'email' | 'password';

export function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Errors only show for fields the user has finished with, or after they press Log in.
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  const markTouched = (field: Field, value: string) => {
    // Don't flag an empty field just because the user tabbed past it.
    console.log(touched,"touched")

    if (value.length > 0){
      setTouched(current => ({ ...current, [field]: true }));
      }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    Keyboard.dismiss();
    setSubmitError(undefined);
    setIsSubmitting(true);
    try {
      await signIn(email);
      // On success the navigator swaps this screen for Home, so there's no state to reset.
    } catch {
      setSubmitError(
        'Couldn’t log you in. Check your connection and try again.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top + spacing.xxxl,
              paddingBottom: insets.bottom + spacing.xl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <FlameMark size={64} />
            <Text style={styles.title} accessibilityRole="header">
              Log in to Streaks
            </Text>
            <Text style={styles.subtitle}>
              Pick up where you left off and keep your streak going.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              onBlur={() => markTouched('email', email)}
              error={touched.email ? emailError : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isSubmitting}
            />

            <TextField
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              value={password}
              onChangeText={setPassword}
              onBlur={() => markTouched('password', password)}
              error={touched.password ? passwordError : undefined}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!isSubmitting}
            />

            {submitError ? (
              <Text style={styles.submitError} accessibilityRole="alert">
                {submitError}
              </Text>
            ) : null}

            <AppButton
              title="Log in"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.button}
            />
          </View>

          <Text style={styles.demoNote}>
            This is a demo. Any valid email and a password of{' '}
            {MIN_PASSWORD_LENGTH} or more characters will log you in.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  header: {
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
  },
  form: {
    gap: spacing.lg,
  },
  submitError: {
    ...typography.caption,
    color: colors.error,
  },
  button: {
    marginTop: spacing.sm,
  },
  demoNote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
