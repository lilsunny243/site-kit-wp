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
import { useWindowWidth } from '@react-hook/window-size/throttled';

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
import { getTimeInSeconds } from '../../../../util';
import { ACCOUNT_STATUS_READY, SITE_STATUS_READY } from '../../util';
const { useSelect, useDispatch } = Data;

export default function AdBlockingRecoveryWidget( { Widget, WidgetNull } ) {
	const AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG =
		'ad-blocker-recovery-notification';
	const windowWidth = useWindowWidth();

	const showTooltip = useShowTooltip( AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG );
	const { isTooltipVisible } = useTooltipState(
		AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG
	);

	const isDismissed = useSelect( ( select ) =>
		select( CORE_USER ).isItemDismissed(
			AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG
		)
	);
	const learnMoreURL = useSelect( ( select ) =>
		select( CORE_SITE ).getGoogleSupportURL( {
			path: '/adsense/answer/11576589',
		} )
	);
	const recoveryPageURL = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-ad-blocking-recovery' )
	);
	const setupCompletedTimestamp = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getSetupCompletedTimestamp()
	);
	const adBlockingRecoverySetupStatus = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getAdBlockingRecoverySetupStatus()
	);
	const adSenseModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'adsense' )
	);
	const accountStatus = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getAccountStatus()
	);
	const siteStatus = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getSiteStatus()
	);

	const { dismissItem } = useDispatch( CORE_USER );
	const dismissCallback = async () => {
		await dismissItem( AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG );
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
					tooltipStateKey={ AD_BLOCKER_RECOVERY_NOTIFICATION_SLUG }
				/>
			</Fragment>
		);
	}

	const THREE_WEEKS_IN_SECONDS = getTimeInSeconds( 'week' ) * 3;
	const NOW_IN_SECONDS = Math.floor( Date.now() / 1000 );

	if (
		adSenseModuleConnected &&
		isDismissed === false &&
		adBlockingRecoverySetupStatus !== '' &&
		accountStatus === ACCOUNT_STATUS_READY &&
		siteStatus === SITE_STATUS_READY &&
		( ! setupCompletedTimestamp ||
			NOW_IN_SECONDS - setupCompletedTimestamp > THREE_WEEKS_IN_SECONDS )
	) {
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
										a: (
											<Link
												href={ learnMoreURL }
												external
											/>
										),
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
							dismissLabel={ __(
								'Maybe later',
								'google-site-kit'
							) }
						/>
					</Cell>

					<Cell
						className="googlesitekit-widget--adBlockingRecovery__graphics"
						smSize={ 8 }
						mdSize={ 4 }
						lgSize={ 5 }
					>
						{ windowWidth > 600 && (
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

	return <WidgetNull />;
}

AdBlockingRecoveryWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType.isRequired,
};
