import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        'sourceType': 'script'
      }
    }
  },
  { languageOptions: { globals: globals.node } },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': [
        'error',
        2
      ],
      '@stylistic/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/quotes': [
        'error',
        'single'
      ],
      '@stylistic/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'caughtErrors': 'all',
        'ignoreRestSiblings': false,
        'reportUsedIgnorePattern': false,
        'varsIgnorePattern': '[iI]gnored',
        'argsIgnorePattern': '[iI]gnored'
      }]
    }
  },
  pluginJs.configs.recommended,
  {
    ignores: ['dist']
  },
]