module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  // These packages ship untranspiled code, so Babel must process them too.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-vector-icons|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-linear-gradient)/)',
  ],
};
