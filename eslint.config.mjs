import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default antfu(
	{
		react: true,
		typescript: true,

		formatters: {
			css: true,
			html: true,
			markdown: true,
			json: true,
			yaml: true,
		},
		stylistic: {
			indent: 'tab',
			semi: true,
			quotes: 'single',
			arrowParens: 'always',
		},

		rules: {
			'camelcase': ['error', { ignoreImports: true }],
			'import/no-default-export': 'off',
			'style/multiline-ternary': 'off',
			'ts/no-explicit-any': 'error',
		},

		ignores: [
			'.agents',
			'.claude',
			'.next',
			'node_modules',
			'dist',
			'build',
			'public',
			'src/components/ui',
			'*.min.*',
			'**/.agents',
			'**/.claude',
		],
	},

	// Next.js core web vitals rules
	{
		plugins: {
			'@next/next': nextPlugin,
		},
		rules: {
			...nextPlugin.configs['core-web-vitals'].rules,
		},
	},

	// Markdown overrides
	{
		files: ['**/*.md'],
		rules: {
			'style/no-mixed-spaces-and-tabs': 'off',
		},
	},

	// Accessibility (jsx-a11y) — Strict Mode
	{
		plugins: {
			'jsx-a11y': jsxA11y,
		},
		rules: {
			'jsx-a11y/alt-text': 'error',
			'jsx-a11y/anchor-has-content': 'error',
			'jsx-a11y/anchor-is-valid': 'error',
			'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
			'jsx-a11y/aria-props': 'error',
			'jsx-a11y/aria-proptypes': 'error',
			'jsx-a11y/aria-role': 'error',
			'jsx-a11y/aria-unsupported-elements': 'error',
			'jsx-a11y/click-events-have-key-events': 'error',
			'jsx-a11y/heading-has-content': 'error',
			'jsx-a11y/html-has-lang': 'error',
			'jsx-a11y/img-redundant-alt': 'error',
			'jsx-a11y/interactive-supports-focus': 'error',
			'jsx-a11y/label-has-associated-control': 'error',
			'jsx-a11y/media-has-caption': 'error',
			'jsx-a11y/mouse-events-have-key-events': 'error',
			'jsx-a11y/no-access-key': 'error',
			'jsx-a11y/no-autofocus': 'warn',
			'jsx-a11y/no-distracting-elements': 'error',
			'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
			'jsx-a11y/no-noninteractive-element-interactions': 'error',
			'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
			'jsx-a11y/no-noninteractive-tabindex': 'error',
			'jsx-a11y/no-redundant-roles': 'error',
			'jsx-a11y/no-static-element-interactions': 'error',
			'jsx-a11y/role-has-required-aria-props': 'error',
			'jsx-a11y/role-supports-aria-props': 'error',
			'jsx-a11y/scope': 'error',
			'jsx-a11y/tabindex-no-positive': 'error',
		},
	},
);
