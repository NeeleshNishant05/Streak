# Streaks

A daily habit-tracking app front end built with **React Native CLI** (no Expo). It covers the full flow from splash screen to the signed-in home screen, using static data and a mock login.

## Setup

**Prerequisites:** Node 22.11 or newer, plus a working React Native environment for your platform (Android Studio with an emulator, and/or Xcode with CocoaPods on macOS). If you haven't set one up, follow the "Set up your environment" guide on reactnative.dev for React Native 0.88.

```sh
npm install

# iOS only (macOS)
cd ios && bundle install && bundle exec pod install && cd ..

# Start Metro in one terminal
npm start

# Run the app in another terminal
npm run android
npm run ios
```

**Checks:**

```sh
npm run typecheck   # TypeScript
npm run lint        # ESLint (React Native community config)
npm test            # Jest: unit tests and full-flow integration tests
```

**Trying the app:** on the login screen, any valid email (for example `jane.doe@example.com`) and any password of 6 or more characters will log you in. The name shown in the app comes from the email address ("Jane Doe"). To see onboarding again, uninstall the app or clear its storage.

## What's included

| Screen | What it does |
| --- | --- |
| Splash | The flame logo springs in with a glow, then the wordmark rises. It moves on automatically once the animation has played *and* the saved session has been read. |
| Onboarding | 3 swipeable slides, each with an animated illustration built from views (no images). The page indicator and parallax follow your finger. Includes Next, Skip and "Get started". |
| Login | Email and password with validation, a show/hide password toggle, keyboard Next/Go handling, a loading state, and mock auth. |
| Home tab | Time-based greeting, streak card with the last 7 days, today's progress card and today's habits. Tapping a habit updates both cards, and finishing them all adds today to your streak. |
| Profile tab | Avatar with initials, name, email, four detail rows and Log out. |

Login is persisted (the bonus): restart the app and you stay signed in. Log out clears the saved session and returns you to Login.

## Project structure

```
App.tsx                  Providers: safe area, auth, navigation container
src/
  components/            Reusable UI: AppButton, TextField, Card, GradientBorder, GradientBackground,
                         PageIndicator, ProgressBar, Avatar, FlameMark
  context/AuthContext    Session + onboarding state, persisted with AsyncStorage
  navigation/            RootNavigator (stack), MainTabs (bottom tabs), typed route params
  screens/               Splash, Login, onboarding/, home/, profile/ (screen-specific parts live beside their screen)
  data/mockData.ts       All static content in one place
  theme/                 Colours, gradients, spacing, radii, type scale
  hooks/useReducedMotion Follows the OS "Reduce motion" setting
  utils/                 Validation, name and date helpers (pure functions, unit tested)
__tests__/               Jest tests
```

## Decisions

**React Native CLI, not Expo.** This is a bare project: the native `android/` and `ios/` folders are checked in and edited directly. Native changes made:
- Launch screen colour set to match the splash gradient, so there's no white flash before JavaScript loads. On Android this is `windowBackground` in `styles.xml`; on iOS it's `LaunchScreen.storyboard`.
- The app is locked to portrait on phones.

**Navigation is driven by auth state.** `RootNavigator` decides which screens exist from `status` and `hasOnboarded`, instead of calling `navigate()` after login or logout. This is React Navigation's recommended auth pattern. Because the old screens are removed from the stack, pressing Back after logging in can't return to Login, and Back after logging out can't return to Home.

**The built-in Animated API, not Reanimated.** The animations here are simple loops and scroll-linked transforms. `Animated` with `useNativeDriver: true` runs them on the native thread, with no extra native dependency or Babel plugin. The one exception is the progress bar: it animates `width`, which the native driver can't do, but it only runs when a habit is toggled.

**Gradient borders.** React Native borders can't be gradients, so `GradientBorder` draws a gradient and places an opaque view on top, inset by the border width. Inputs, outline buttons and highlighted cards all use it.

**Onboarding uses a paged `ScrollView`, not a `FlatList`.** There are only 3 fixed slides, so virtualization adds complexity with no benefit. Only the visible slide's illustration animates.

**Onboarding is shown once.** An `onboarded` flag is saved, so returning signed-out users go straight to Login. That's also why Log out lands on Login rather than onboarding.

**Habit toggling is local state.** The brief asks for static content. Making habits tappable shows real state flowing into the cards, but nothing is saved, so the list resets on restart.

**Accessibility.**
- Buttons, checkboxes and the progress bar have roles, labels and states for screen readers.
- Validation errors are announced.
- Decorative loops stop when the OS "Reduce motion" setting is on.

**Dependencies** (each one is needed for a stated requirement):
- `@react-navigation/native`, `native-stack`, `bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`: stack and tab navigation.
- `react-native-linear-gradient`: gradient backgrounds and borders.
- `@react-native-async-storage/async-storage`: persisted login.
- `@react-native-vector-icons/ionicons`: icons. Its fonts are linked automatically on both platforms.

Versions are pinned exactly.

## Verification

- `tsc`, ESLint and Prettier pass with no errors or warnings.
- 19 Jest tests pass. They include integration tests that render the real `App` with real navigation and auth, covering:
  - onboarding → validation errors → login → Home → toggling a habit → Profile → logout clears the session;
  - restoring a saved session;
  - skipping onboarding for returning users;
  - corrupt saved data.
- In Jest, native modules (storage, gradient, icons, safe area) are replaced with mocks.

## Known limitations

- No backend. Login is mocked, and habit changes aren't saved.
- Animations, transitions and keyboard behaviour were written for and reasoned about on both platforms, but they should be checked on a real device or emulator.
- Swipe progress on onboarding isn't covered by tests, because Jest can't simulate native scrolling.
