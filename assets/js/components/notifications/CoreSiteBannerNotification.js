/**
 * CoreSiteBannerNotification component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { useMount } from 'react-use';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import BannerNotification from './BannerNotification';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { VIEW_CONTEXT_DASHBOARD } from '../../googlesitekit/constants';
import { trackEvent } from '../../util';

const { useDispatch } = Data;

const CoreSiteBannerNotification = ( {
	content,
	ctaLabel,
	ctaTarget,
	ctaURL,
	dismissLabel,
	dismissible,
	id,
	learnMoreLabel,
	learnMoreURL,
	title,
} ) => {
	const { dismissNotification, acceptNotification } = useDispatch(
		CORE_SITE
	);

	useMount( () => {
		trackEvent(
			`${ VIEW_CONTEXT_DASHBOARD }_remote-site-notification`,
			'view_notification',
			id
		);
	} );

	const onCTAClick = useCallback( () => {
		acceptNotification( id );
		trackEvent(
			`${ VIEW_CONTEXT_DASHBOARD }_remote-site-notification`,
			'confirm_notification',
			id
		);
	}, [ id, acceptNotification ] );

	const onDismiss = useCallback( () => {
		dismissNotification( id );
		trackEvent(
			`${ VIEW_CONTEXT_DASHBOARD }_remote-site-notification`,
			'dismiss_notification',
			id
		);
	}, [ id, dismissNotification ] );

	const onLearnMoreClick = useCallback( () => {
		trackEvent(
			`${ VIEW_CONTEXT_DASHBOARD }_remote-site-notification`,
			'click_learn_more_link',
			id
		);
	}, [ id ] );

	return (
		<BannerNotification
			key={ id }
			id={ id }
			title={ title }
			description={ content }
			learnMoreURL={ learnMoreURL }
			learnMoreLabel={ learnMoreLabel }
			ctaLink={ ctaURL }
			ctaLabel={ ctaLabel }
			ctaTarget={ ctaTarget }
			dismiss={ dismissLabel }
			isDismissible={ dismissible }
			onCTAClick={ onCTAClick }
			onDismiss={ onDismiss }
			onLearnMoreClick={ onLearnMoreClick }
		/>
	);
};

CoreSiteBannerNotification.propTypes = {
	content: PropTypes.string,
	ctaLabel: PropTypes.string,
	ctaTarget: PropTypes.string,
	ctaURL: PropTypes.string,
	dismissLabel: PropTypes.string,
	dismissible: PropTypes.bool,
	id: PropTypes.string.isRequired,
	learnMoreLabel: PropTypes.string,
	learnMoreURL: PropTypes.string,
	title: PropTypes.string.isRequired,
};

CoreSiteBannerNotification.defaultProps = {
	content: '',
	ctaLabel: '',
	ctaTarget: '',
	ctaURL: '',
	dismissLabel: __( 'OK, Got it!', 'google-site-kit' ),
	dismissible: true,
	learnMoreLabel: '',
	learnMoreURL: '',
};

export default CoreSiteBannerNotification;
