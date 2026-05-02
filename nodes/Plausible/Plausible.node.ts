import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class Plausible implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plausible',
		name: 'plausible',
		icon: 'file:plausible.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Plausible Analytics API',
		usableAsTool: true,
		defaults: {
			name: 'Plausible',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'plausibleApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Aggregate Stats',
						value: 'aggregate',
						description: 'Get aggregate stats for pageviews, visits, and bounce rate',
						action: 'Get aggregate stats',
					},
					{
						name: 'Get Breakdown',
						value: 'breakdown',
						description: 'Get stats broken down by a property such as page or country',
						action: 'Get breakdown',
					},
					{
						name: 'Get Realtime Visitors',
						value: 'realtimeVisitors',
						description: 'Get number of current visitors on your site',
						action: 'Get realtime visitors',
					},
				],
				default: 'realtimeVisitors',
			},
			{
				displayName: 'Site ID',
				name: 'siteId',
				type: 'string',
				default: '',
				required: true,
				description: 'Your site domain as configured in Plausible (e.g. yourdomain.com)',
			},
			{
				displayName: 'Time Period',
				name: 'period',
				type: 'options',
				options: [
					{ name: 'Last 12 Months', value: '12mo' },
					{ name: 'Last 30 Days', value: '30d' },
					{ name: 'Last 6 Months', value: '6mo' },
					{ name: 'Last 7 Days', value: '7d' },
					{ name: 'Today', value: 'today' },
				],
				default: '30d',
				displayOptions: {
					show: {
						operation: ['aggregate', 'breakdown'],
					},
				},
			},
			{
				displayName: 'Property',
				name: 'property',
				type: 'options',
				options: [
					{ name: 'Browser', value: 'visit:browser' },
					{ name: 'Country', value: 'visit:country' },
					{ name: 'Device', value: 'visit:device' },
					{ name: 'Page', value: 'event:page' },
					{ name: 'Source', value: 'visit:source' },
				],
				default: 'event:page',
				displayOptions: {
					show: {
						operation: ['breakdown'],
					},
				},
				description: 'Property to break stats down by',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('plausibleApi');
		const baseUrl = credentials.baseUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const siteId = this.getNodeParameter('siteId', i) as string;

				let endpoint = '';
				let qs: Record<string, string> = { site_id: siteId };

				if (operation === 'realtimeVisitors') {
					endpoint = '/api/v1/stats/realtime/visitors';
				} else if (operation === 'aggregate') {
					const period = this.getNodeParameter('period', i) as string;
					endpoint = '/api/v1/stats/aggregate';
					qs = {
						...qs,
						period,
						metrics: 'visitors,pageviews,bounce_rate,visit_duration',
					};
				} else if (operation === 'breakdown') {
					const period = this.getNodeParameter('period', i) as string;
					const property = this.getNodeParameter('property', i) as string;
					endpoint = '/api/v1/stats/breakdown';
					qs = {
						...qs,
						period,
						property,
						metrics: 'visitors,pageviews',
					};
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'plausibleApi',
					{
						method: 'GET',
						url: `${baseUrl}${endpoint}`,
						qs,
					},
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}