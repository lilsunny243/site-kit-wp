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
import { createInterpolateElement } from '@wordpress/element';
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
const { useSelect, useDispatch } = Data;

export default function AdBlockingRecoveryWidget( { Widget, WidgetNull } ) {
	const notificationSlug = 'ad-blocker-recovery-notification';
	const windowWidth = useWindowWidth();

	const isDismissed = useSelect( ( select ) =>
		select( CORE_USER ).isItemDismissed( notificationSlug )
	);

	const learnMoreURL = useSelect( ( select ) =>
		select( CORE_SITE ).getGoogleSupportURL( {
			path: '/adsense/answer/11576589',
		} )
	);

	const recoveryPageURL = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-ad-blocking-recovery' )
	);

	const { dismissItem } = useDispatch( CORE_USER );
	const dismissCallback = () => {
		dismissItem( notificationSlug );
	};

	if ( isDismissed ) {
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

					<div className="googlesitekit-widget--adBlockerRecovery__content">
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
						dismissCallback={ dismissCallback }
						dismissLabel={ __( 'Maybe later', 'google-site-kit' ) }
					/>
				</Cell>

				<Cell
					className="googlesitekit-widget--adBlockerRecovery__graphics"
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

AdBlockingRecoveryWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType.isRequired,
};
