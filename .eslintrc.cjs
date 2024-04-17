module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
},
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'comma-dangle': ['error', 'always-multiline' ],
    quotes: [2, 'single', { 'avoidEscape': true }],
    indent: ['error', 4, {'SwitchCase': 1}],
    'object-curly-spacing': ['error', 'always'],
    semi: ['error', 'always'],
    'react/jsx-first-prop-new-line': [1, 'multiline'],
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-max-props-per-line': [1,
			{
				'maximum': 1
			}
		],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-no-target-blank': 'off',
    'react/prop-types': 0,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
