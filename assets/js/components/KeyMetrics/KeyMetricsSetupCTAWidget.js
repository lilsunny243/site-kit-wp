/**
 * KeyMetricsSetupCTAWidget component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { Button } from 'googlesitekit-components';
import Link from '../Link';
import KeyMetricsCTAContent from './KeyMetricsCTAContent';
import KeyMetricsCTAFooter from './KeyMetricsCTAFooter';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { MODULES_SEARCH_CONSOLE } from '../../modules/search-console/datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../modules/analytics-4/datastore/constants';
import { useFeature } from '../../hooks/useFeature';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import {
	AdminMenuTooltip,
	useShowTooltip,
	useTooltipState,
} from '../AdminMenuTooltip';
import { KEY_METRICS_SETUP_CTA_WIDGET_SLUG } from './constants';
const { useDispatch, useSelect } = Data;

function KeyMetricsSetupCTAWidget( { Widget, WidgetNull } ) {
	const userInputEnabled = useFeature( 'userInput' );

	const isUserInputCompleted = useSelect( ( select ) =>
		select( CORE_USER ).isUserInputCompleted()
	);
	const searchConsoleModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'search-console' )
	);
	const analyticsModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'analytics-4' )
	);
	const ctaLink = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-user-input' )
	);
	const searchConsoleIsGatheringData = useSelect(
		( select ) =>
			searchConsoleModuleConnected &&
			select( MODULES_SEARCH_CONSOLE ).isGatheringData()
	);
	const analyticsIsGatheringData = useSelect(
		( select ) =>
			analyticsModuleConnected &&
			select( MODULES_ANALYTICS_4 ).isGatheringData()
	);

	const showTooltip = useShowTooltip( KEY_METRICS_SETUP_CTA_WIDGET_SLUG );
	const { isTooltipVisible } = useTooltipState(
		KEY_METRICS_SETUP_CTA_WIDGET_SLUG
	);
	const isDismissed = useSelect( ( select ) =>
		select( CORE_USER ).isItemDismissed( KEY_METRICS_SETUP_CTA_WIDGET_SLUG )
	);

	const { dismissItem } = useDispatch( CORE_USER );
	const dismissCallback = async () => {
		await dismissItem( KEY_METRICS_SETUP_CTA_WIDGET_SLUG );
	};

	if ( isTooltipVisible ) {
		return (
			<Fragment>
				<WidgetNull />
				<AdminMenuTooltip
					title={ __(
						'You can always set up goals from Settings later',
						'google-site-kit'
					) }
					content={ __(
						'The Key Metrics section will be added back to your dashboard once you set your goals in Settings.',
						'google-site-kit'
					) }
					dismissLabel={ __( 'Got it', 'google-site-kit' ) }
					onDismiss={ dismissCallback }
					tooltipStateKey={ KEY_METRICS_SETUP_CTA_WIDGET_SLUG }
				/>
			</Fragment>
		);
	}

	if (
		! userInputEnabled ||
		isUserInputCompleted !== false ||
		isDismissed !== false ||
		! analyticsModuleConnected ||
		! searchConsoleModuleConnected ||
		analyticsIsGatheringData !== false ||
		searchConsoleIsGatheringData !== false
	) {
		return <WidgetNull />;
	}

	return (
		<Widget
			noPadding
			Footer={ () => {
				return <KeyMetricsCTAFooter onActionClick={ showTooltip } />;
			} }
		>
			<KeyMetricsCTAContent
				title={ __(
					'Get metrics and suggestions tailored to your specific goals',
					'google-site-kit'
				) }
				description={ __(
					'Answer 3 questions to show relevant stats for your site',
					'google-site-kit'
				) }
				actions={
					<Fragment>
						<Button
							className="googlesitekit-key-metrics-cta-button"
							href={ ctaLink }
						>
							{ __( 'Get tailored metrics', 'google-site-kit' ) }
						</Button>
						{ /*
							The `onClick` prop is used to ensure consistent styling for the link button across various widgets and banners.
							In the future, it will also serve the purpose of adding a track event.
						*/ }
						<Link onClick={ () => {} }>
							{ __(
								'I’ll pick metrics myself',
								'google-site-kit'
							) }
						</Link>
					</Fragment>
				}
			/>
		</Widget>
	);
}

KeyMetricsSetupCTAWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType,
};

export default KeyMetricsSetupCTAWidget;
