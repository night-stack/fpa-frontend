module.exports = {
  root: true,
  extends: [
    // 'airbnb-base',
    // 'prettier',
    // 'plugin:vue/base',
    // 'plugin:vue/essential',
    // 'plugin:vue/strongly-recommended',
    // 'plugin:vue/recommended',
  ],
  plugins: [
    'vue',
    'import',
    'jest',
  ],
  env: {
    jest: true,
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    parser: 'babel-eslint',
  },
  rules: {
    'no-mixed-operators': 'off',
    'no-param-reassign': 0,
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'linebreak-style': 'off',
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'no-console': [
      'off',
      {
        allow: [
          'warn',
          'info',
          'error',
        ],
      },
    ],
    'max-len': [
      'error',
      10000,
      2,
      {
        ignoreComments: true,
      },
    ],
  },
};
