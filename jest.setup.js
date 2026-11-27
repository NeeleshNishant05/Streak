/* eslint-env jest */

// Native modules don't exist under Jest, so swap them for simple stand-ins.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('@react-native-vector-icons/ionicons/static', () => ({
  Ionicons: () => null,
}));
