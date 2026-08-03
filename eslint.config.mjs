import n8nNodesBaseConfig from '@n8n/eslint-config/nodes';

const config = [
	...n8nNodesBaseConfig,
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
];

export default config;
