/**
 * TopTrafficSourceWidget Component Stories.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import {
	provideKeyMetrics,
	provideModules,
} from '../../../../../../tests/js/utils';
import { withWidgetComponentProps } from '../../../../googlesitekit/widgets/util';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import TopTrafficSourceWidget from './TopTrafficSourceWidget';
import { MODULES_ANALYTICS_4 } from '../../datastore/constants';
import {
	getAnalytics4MockResponse,
	provideAnalytics4MockReport,
} from '../../utils/data-mock';
import { replaceValuesInAnalytics4ReportWithZeroData } from '../../../../../../.storybook/utils/zeroReports';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';

const reportOptions = [
	{
		compareStartDate: '2020-07-14',
		compareEndDate: '2020-08-10',
		startDate: '2020-08-11',
		endDate: '2020-09-07',
		metrics: [
			{
				name: 'totalUsers',
			},
		],
	},
	{
		compareStartDate: '2020-07-14',
		compareEndDate: '2020-08-10',
		startDate: '2020-08-11',
		endDate: '2020-09-07',
		dimensions: [ 'sessionDefaultChannelGroup' ],
		metrics: [
			{
				name: 'totalUsers',
			},
		],
		limit: 1,
		orderBy: 'totalUsers',
	},
];

const WidgetWithComponentProps = withWidgetComponentProps(
	'kmAnalyticsTopTrafficSource'
)( TopTrafficSourceWidget );

const Template = ( { setupRegistry, ...args } ) => (
	<WithRegistrySetup func={ setupRegistry }>
		<WidgetWithComponentProps { ...args } />
	</WithRegistrySetup>
);

export const Ready = Template.bind( {} );
Ready.storyName = 'Ready';
Ready.args = {
	setupRegistry: ( registry ) => {
		reportOptions.forEach( ( options ) =>
			provideAnalytics4MockReport( registry, options )
		);
	},
};
Ready.scenario = {
	label: 'KeyMetrics/TopTrafficSourceWidget/Ready',
	delay: 250,
};

export const Loading = Template.bind( {} );
Loading.storyName = 'Loading';
Loading.args = {
	setupRegistry: ( { dispatch } ) => {
		dispatch( MODULES_ANALYTICS_4 ).startResolution( 'getReport', [
			reportOptions[ 0 ],
		] );
		dispatch( MODULES_ANALYTICS_4 ).startResolution( 'getReport', [
			reportOptions[ 1 ],
		] );
	},
};

export const ZeroData = Template.bind( {} );
ZeroData.storyName = 'Zero Data';
ZeroData.args = {
	setupRegistry: ( { dispatch } ) => {
		reportOptions.forEach( ( options ) => {
			dispatch( MODULES_ANALYTICS_4 ).receiveGetReport(
				replaceValuesInAnalytics4ReportWithZeroData(
					getAnalytics4MockResponse( options )
				),
				{
					options,
				}
			);
		} );
	},
};
ZeroData.scenario = {
	label: 'KeyMetrics/TopTrafficSourceWidget/ZeroData',
	delay: 250,
};

export default {
	title: 'Key Metrics/TopTrafficSource',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: 'analytics-4',
						active: true,
						connected: true,
					},
				] );

				registry.dispatch( CORE_USER ).setReferenceDate( '2020-09-08' );

				provideKeyMetrics( registry );

				// Call story-specific setup.
				args.setupRegistry( registry );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};
