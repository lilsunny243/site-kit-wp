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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { Fragment, createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import AdsenseAdBlockingRecoverySVG from '../../../../../svg/graphics/adsense-ad-blocking-recovery.svg';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { Cell } from '../../../../material-components';
import BannerTitle from '../../../../components/notifications/BannerNotification/BannerTitle';
import BannerActions from '../../../../components/notifications/BannerNotification/BannerActions';
import Banner from '../../../../components/notifications/BannerNotification/Banner';
import Link from '../../../../components/Link';
import {
	AdminMenuTooltip,
	useShowTooltip,
	useTooltipState,
} from '../../../../components/AdminMenuTooltip';
import { CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import { MODULES_ADSENSE } from '../../datastore/constants';
import { WEEK_IN_SECONDS } from '../../../../util';
import { ACCOUNT_STATUS_READY, SITE_STATUS_READY } from '../../util';
import useViewOnly from '../../../../hooks/useViewOnly';
import {
	BREAKPOINT_SMALL,
	useBreakpoint,
} from '../../../../hooks/useBreakpoint';
const { useSelect, useDispatch } = Data;

export default function AdBlockingRecoveryWidget( { Widget, WidgetNull } ) {
	const AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG =
		'ad-blocking-recovery-notification';
	const breakpoint = useBreakpoint();
	const viewOnlyDashboard = useViewOnly();

	const showTooltip = useShowTooltip(
		AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG
	);
	const { isTooltipVisible } = useTooltipState(
		AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG
	);
	const isDismissed = useSelect( ( select ) =>
		select( CORE_USER ).isItemDismissed(
			AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG
		)
	);
	const adSenseModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'adsense' )
	);
	const adBlockingRecoverySetupStatus = useSelect( ( select ) => {
		if ( viewOnlyDashboard ) {
			return null;
		}
		return select( MODULES_ADSENSE ).getAdBlockingRecoverySetupStatus();
	} );
	const accountStatus = useSelect( ( select ) => {
		if ( viewOnlyDashboard ) {
			return null;
		}
		return select( MODULES_ADSENSE ).getAccountStatus();
	} );
	const setupCompletedTimestamp = useSelect( ( select ) => {
		if ( viewOnlyDashboard ) {
			return null;
		}
		return select( MODULES_ADSENSE ).getSetupCompletedTimestamp();
	} );
	const siteStatus = useSelect( ( select ) => {
		if ( viewOnlyDashboard ) {
			return null;
		}
		return select( MODULES_ADSENSE ).getSiteStatus();
	} );
	const learnMoreURL = useSelect( ( select ) =>
		select( CORE_SITE ).getGoogleSupportURL( {
			path: '/adsense/answer/11576589',
		} )
	);
	const recoveryPageURL = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-ad-blocking-recovery' )
	);

	const { dismissItem } = useDispatch( CORE_USER );
	const dismissCallback = async () => {
		await dismissItem( AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG );
	};

	if ( isTooltipVisible ) {
		return (
			<Fragment>
				<WidgetNull />
				<AdminMenuTooltip
					title={ __(
						'You can always set up ad blocking recovery from Settings later',
						'google-site-kit'
					) }
					dismissLabel={ __( 'Got it', 'google-site-kit' ) }
					onDismiss={ dismissCallback }
					tooltipStateKey={ AD_BLOCKING_RECOVERY_NOTIFICATION_SLUG }
				/>
			</Fragment>
		);
	}

	const threeWeeksInSeconds = WEEK_IN_SECONDS * 3;
	const nowInSeconds = Math.floor( Date.now() / 1000 );

	const shouldShowWidget =
		! viewOnlyDashboard &&
		adSenseModuleConnected &&
		isDismissed === false &&
		adBlockingRecoverySetupStatus !== '' &&
		accountStatus === ACCOUNT_STATUS_READY &&
		siteStatus === SITE_STATUS_READY &&
		( ! setupCompletedTimestamp ||
			nowInSeconds - setupCompletedTimestamp >= threeWeeksInSeconds );

	if ( ! shouldShowWidget ) {
		return <WidgetNull />;
	}

	return (
		<Widget>
			<Banner>
				<Cell smSize={ 8 } mdSize={ 4 } lgSize={ 7 }>
					<BannerTitle
						title={ __(
							'Recover revenue lost to ad blockers',
							'google-site-kit'
						) }
					/>

					<div className="googlesitekit-widget--adBlockingRecovery__content">
						<p>
							{ createInterpolateElement(
								__(
									'Display a message to give site visitors with an ad blocker the option to allow ads on your site. Site Kit will place an ad blocking recovery tag on your site. <a>Learn more</a>',
									'google-site-kit'
								),
								{
									a: <Link href={ learnMoreURL } external />,
								}
							) }
						</p>
						<p>
							{ __(
								'Publishers see up to 1 in 5 users choose to allow ads once they encounter an ad blocking recovery message*',
								'google-site-kit'
							) }
						</p>
					</div>

					<BannerActions
						ctaLabel={ __( 'Set up now', 'google-site-kit' ) }
						ctaLink={ recoveryPageURL }
						dismissCallback={ () => {
							showTooltip();
						} }
						dismissLabel={ __( 'Maybe later', 'google-site-kit' ) }
					/>
				</Cell>

				<Cell
					className="googlesitekit-widget--adBlockingRecovery__graphics"
					smSize={ 8 }
					mdSize={ 4 }
					lgSize={ 5 }
				>
					{ breakpoint !== BREAKPOINT_SMALL && (
						<AdsenseAdBlockingRecoverySVG
							style={ {
								maxHeight: '172px',
							} }
						/>
					) }

					<p>
						{ __(
							'*Average for publishers showing non-dismissible ad blocking recovery messages placed at the center of the page on desktop',
							'google-site-kit'
						) }
					</p>
				</Cell>
			</Banner>
		</Widget>
	);
}

AdBlockingRecoveryWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType.isRequired,
};
