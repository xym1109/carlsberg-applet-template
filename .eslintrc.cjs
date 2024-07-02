module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: { parser: '@typescript-eslint/parser' },

  overrides: [],
  ignorePatterns: [
    '/src/wxcomponents/@vant/',
    '/src/utils/carlsbergTrack/',
    '/src/utils/carlsbergSentry/'
  ],

  globals: {
    uni: true,
    UniApp: true,
    wx: true,
    getApp: true,
    requirePlugin: true,
    requireMiniProgram: true
  },

  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    './.eslintrc-auto-import.json'
  ],
  plugins: ['vue', '@typescript-eslint'],

  rules: {
    'prefer-const': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/custom-event-name-casing': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$'
      }
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$'
      }
    ],
    'space-before-function-paren': 'off',
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignores: ['view', 'text']
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5
        },
        multiline: {
          max: 5
        }
      }
    ],
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        }
      }
    ],
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off'
  }
};