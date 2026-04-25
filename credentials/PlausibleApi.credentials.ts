import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PlausibleApi implements ICredentialType {
	name = 'plausibleApi';
	displayName = 'Plausible API';
	icon = 'file:plausible.svg' as const;
	documentationUrl = 'https://plausible.io/docs/stats-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Plausible API key. Find it in your account settings.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://plausible.io',
			required: true,
			description: 'Base URL of your Plausible instance. Use https://plausible.io for cloud.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/stats/realtime/visitors?site_id=test',
		},
	};
}