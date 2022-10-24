/**
 * Site Kit by Google, Copyright 2022 Google LLC
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
 * WordPress dependencies
 */
import { _x, __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ThankWithGoogleIconSVG from '../../../../../svg/graphics/thank-with-google.svg';
import Badge from '../../../../components/Badge';

export default function SetupHeader() {
	return (
		<div className="googlesitekit-setup-module__header">
			<div className="googlesitekit-setup-module__logo">
				<ThankWithGoogleIconSVG width="33" height="33" />
			</div>
			<div className="googlesitekit-setup-module__title-container">
				<h2 className="googlesitekit-heading-3 googlesitekit-setup-module__title">
					{ _x(
						'Thank with Google',
						'Service name',
						'google-site-kit'
					) }
				</h2>
				<div className="googlesitekit-setup-module__badges">
					<Badge label={ __( 'Experimental', 'google-site-kit' ) } />
					<Badge label={ __( 'US Only', 'google-site-kit' ) } />
				</div>
			</div>
		</div>
	);
}
