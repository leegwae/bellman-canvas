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
    'linebreak-style': 0,
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'lines-between-class-members': 'off',
    'no-return-await': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
};
