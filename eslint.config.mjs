import { config as n8nNodesBaseConfig } from '@n8n/node-cli/eslint';

const config = [
	...n8nNodesBaseConfig,
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
];

export default config;
