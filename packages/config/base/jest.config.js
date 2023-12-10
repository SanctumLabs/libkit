module.exports = {
  globals: {
    __DEV__: true,
  },
  passWithNoTests: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', '__tests__/fixtures.(js|ts)'],
  transformIgnorePatterns: [
    'node_modules/(?!(@?react-native[^/]*|@?react-native-[^/]*|@sentry/react-native|p-retry|launchdarkly-react-native-client-sdk)/)',
  ],
};
