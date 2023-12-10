module.exports = {
  '*.{ts,tsx}': ['yarn format', 'yarn lint', () => 'yarn types'],
};
