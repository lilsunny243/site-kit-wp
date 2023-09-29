/**
 * MetricsSelectionPanel Component Stories.
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
import WithRegistrySetup from '../../../../../tests/js/WithRegistrySetup';
import {
	provideKeyMetrics,
	provideModules,
	provideUserAuthentication,
} from '../../../../../tests/js/utils';
import { CORE_UI } from '../../../googlesitekit/datastore/ui/constants';
import { KEY_METRICS_SELECTION_PANEL_OPENED_KEY } from '../constants';
import { KEY_METRICS_WIDGETS } from '../key-metrics-widgets';
import { provideKeyMetricsWidgetRegistrations } from '../test-utils';
import MetricsSelectionPanel from './';

const Template = () => <MetricsSelectionPanel />;

export const Default = Template.bind( {} );
Default.storyName = 'MetricsSelectionPanel';
Default.scenario = {
	label: 'KeyMetrics/MetricsSelectionPanel',
};

export default {
	title: 'Key Metrics/MetricsSelectionPanel',
	component: MetricsSelectionPanel,
	decorators: [
		( Story ) => {
			const setupRegistry = ( registry ) => {
				provideUserAuthentication( registry );

				provideModules( registry, [
					{
						slug: 'analytics-4',
						active: true,
						connected: false,
					},
					{
						slug: 'adsense',
						active: true,
						connected: false,
					},
				] );

				provideKeyMetricsWidgetRegistrations(
					registry,
					Object.keys( KEY_METRICS_WIDGETS ).reduce(
						( acc, widget ) => ( {
							...acc,
							[ widget ]: {
								modules: [
									'search-console',
									'analytics-4',
									'adsense',
								],
							},
						} ),
						{}
					)
				);

				provideKeyMetrics( registry, { widgetSlugs: [] } );

				registry
					.dispatch( CORE_UI )
					.setValue( KEY_METRICS_SELECTION_PANEL_OPENED_KEY, true );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};
