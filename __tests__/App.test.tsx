import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import App from '../App';
import { STORAGE_KEYS } from '../src/context/AuthContext';

jest.useFakeTimers();

// Lets animations, the splash hold and the mock sign-in delay run to completion.
async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

it('takes a new user from onboarding to Home and back out on logout', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await render(<App />);
  await advance(3000);

  // Onboarding
  expect(screen.getByText('Build habits that stick')).toBeTruthy();
  await user.press(screen.getByRole('button', { name: 'Skip' }));
  await advance(500);

  // Login: validation stops an empty submit
  expect(screen.getByText('Log in to Streaks')).toBeTruthy();
  await user.press(screen.getByRole('button', { name: 'Log in' }));
  expect(screen.getByText('Enter your email address.')).toBeTruthy();
  expect(screen.getByText('Enter your password.')).toBeTruthy();

  await user.type(screen.getByLabelText('Email'), 'jane.doe@example.com');
  await user.type(screen.getByLabelText('Password'), 'secret1');
  await user.press(screen.getByRole('button', { name: 'Log in' }));
  await advance(1500);

  // Home
  expect(screen.getByText(/, Jane$/)).toBeTruthy();
  expect(await AsyncStorage.getItem(STORAGE_KEYS.session)).toBe(
    JSON.stringify({ email: 'jane.doe@example.com', name: 'Jane Doe' }),
  );

  // Ticking a habit updates the progress card
  expect(screen.getByText('3 of 5 habits done')).toBeTruthy();
  await user.press(
    screen.getByRole('checkbox', { name: 'Meditate, 10 minutes' }),
  );
  expect(screen.getByText('4 of 5 habits done')).toBeTruthy();

  // Profile and logout
  await user.press(screen.getByText('Profile'));
  await advance(500);
  expect(screen.getByText('jane.doe@example.com')).toBeTruthy();

  await user.press(screen.getByRole('button', { name: 'Log out' }));
  await advance(500);
  expect(screen.getByText('Log in to Streaks')).toBeTruthy();
  expect(await AsyncStorage.getItem(STORAGE_KEYS.session)).toBeNull();
});

it('keeps a returning user logged in after a restart', async () => {
  await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true');
  await AsyncStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({ email: 'sam@example.com', name: 'Sam' }),
  );

  await render(<App />);
  await advance(3000);

  expect(screen.getByText(/, Sam$/)).toBeTruthy();
  expect(screen.queryByText('Log in to Streaks')).toBeNull();
});

it('skips onboarding for a signed-out user who has already seen it', async () => {
  await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true');

  await render(<App />);
  await advance(3000);

  expect(screen.getByText('Log in to Streaks')).toBeTruthy();
  expect(screen.queryByText('Build habits that stick')).toBeNull();
});

it('treats corrupt saved session data as signed out', async () => {
  await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true');
  await AsyncStorage.setItem(STORAGE_KEYS.session, '{not json');

  await render(<App />);
  await advance(3000);

  expect(screen.getByText('Log in to Streaks')).toBeTruthy();
});
