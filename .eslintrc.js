module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    ecmaVersion: 13,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'no-console': 'off',
  },
};
