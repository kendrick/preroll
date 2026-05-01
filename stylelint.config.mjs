/** @type {import('stylelint').Config} */
export default {
	ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/.next/**'],
	extends: [
		'stylelint-config-standard',
		'@dreamsicle.io/stylelint-config-tailwindcss',
	],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'layer',
					'config',
					'plugin',
					'source',
					'theme',
					'utility',
					'variant',
					'custom-variant',
				],
			},
		],
		'function-no-unknown': [
			true,
			{
				ignoreFunctions: ['theme', 'screen', 'spacing', 'alpha'],
			},
		],
		'custom-property-empty-line-before': null,
		'font-family-name-quotes': null,
		'color-function-notation': null,
		'alpha-value-notation': null,
		'comment-empty-line-before': ['always', { except: ['first-nested'], ignore: ['after-comment'] }],
	},
};
