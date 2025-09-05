// eslint-disable-next-line @typescript-eslint/no-require-imports
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		allowDefaultProject: ['.eslintrc.js'], // Adiciona .eslintrc.js
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'lf' }],
		'@typescript-eslint/no-unsafe-call': 'warn',
		'@typescript-eslint/no-unsafe-member-access': 'warn',
		'@typescript-eslint/no-unsafe-assignment': 'warn',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		"@typescript-eslint/no-unsafe-member-access": "error"
		//	'@typescript-eslint/no-require-imports': 'off', // Desativa a regra

	},
};