/**
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
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import {
	DASHBOARD_VIEW_GA4,
	MODULES_ANALYTICS,
} from '../../modules/analytics/datastore/constants';
import {
	createTestRegistry,
	provideModules,
	provideSiteInfo,
	WithTestRegistry,
} from '../../../../tests/js/utils';
import { enabledFeatures } from '../../features';
import SwitchedToGA4Banner from './SwitchedToGA4Banner';

function Template( { ...args } ) {
	return <SwitchedToGA4Banner { ...args } />;
}

export const SwitchedToGA4BannerAfter = Template.bind( {} );
SwitchedToGA4BannerAfter.storyName = 'After the UA cut-off date';
SwitchedToGA4BannerAfter.args = {
	setupRegistry: ( { dispatch } ) => {
		dispatch( CORE_USER ).setReferenceDate( '2099-01-01' );
	},
};
SwitchedToGA4BannerAfter.scenario = {
	label: 'Components/SwitchedToGA4Banner/SwitchedToGA4BannerAfter',
};

export const SwitchedToGA4BannerBefore = Template.bind( {} );
SwitchedToGA4BannerBefore.storyName = 'Before the UA cut-off date';
SwitchedToGA4BannerBefore.args = {
	setupRegistry: ( { dispatch } ) => {
		dispatch( CORE_USER ).setReferenceDate( '2001-01-01' );
	},
};
SwitchedToGA4BannerBefore.scenario = {
	label: 'Components/SwitchedToGA4Banner/SwitchedToGA4BannerBefore',
};

export default {
	title: 'Components/SwitchedToGA4Banner',
	component: SwitchedToGA4Banner,
	decorators: [
		( Story, { args } ) => {
			enabledFeatures.add( 'ga4Reporting' );

			const registry = createTestRegistry();
			provideSiteInfo( registry );
			provideModules( registry, [
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
				{
					slug: 'analytics-4',
					active: true,
					connected: true,
				},
			] );

			registry.dispatch( CORE_USER ).receiveGetDismissedTours( [] );
			registry.dispatch( MODULES_ANALYTICS ).setSettings( {
				propertyID: 'UA-99999-9',
				dashboardView: DASHBOARD_VIEW_GA4,
			} );

			args.setupRegistry?.( registry );

			return (
				<WithTestRegistry registry={ registry }>
					<Story />
				</WithTestRegistry>
			);
		},
	],
};
