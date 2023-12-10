module.exports = {
  root: true,
  extends: [],
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    // Disable CommonJS restriction for files that are required to be CommonJS.
    {
      files: [
        '.eslintrc.js',
        'babel.config.js',
        'jest.config.js',
        'metro.config.js',
        'react-native.config.js',
        'lint-staged.config.js',
        '__mocks__/**',
      ],
      rules: {
        'max-len': 'off',
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
  },
};
