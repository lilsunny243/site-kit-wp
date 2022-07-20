/**
 * Thank with Google Settings View component.
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
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import DisplaySetting from '../../../../components/DisplaySetting';
import { MODULES_THANK_WITH_GOOGLE } from '../../datastore/constants';
import StoreErrorNotices from '../../../../components/StoreErrorNotices';
import { getColorThemes } from '../../util/settings';
const { useSelect } = Data;

export default function SettingsView() {
	const publicationID = useSelect( ( select ) =>
		select( MODULES_THANK_WITH_GOOGLE ).getPublicationID()
	);
	const colorTheme = useSelect( ( select ) =>
		select( MODULES_THANK_WITH_GOOGLE ).getColorTheme()
	);

	// Bail if the values aren't ready.
	if ( publicationID === undefined ) {
		return null;
	}

	const { name: colorName } =
		getColorThemes()?.find(
			( { colorThemeID } ) => colorThemeID === colorTheme
		) || {};

	return (
		<Fragment>
			<StoreErrorNotices
				moduleSlug="thank-with-google"
				storeName={ MODULES_THANK_WITH_GOOGLE }
			/>

			<div className="googlesitekit-settings-module__meta-items">
				<div className="googlesitekit-settings-module__meta-item">
					<h5 className="googlesitekit-settings-module__meta-item-type">
						{ __( 'Publication ID', 'google-site-kit' ) }
					</h5>
					<p className="googlesitekit-settings-module__meta-item-data">
						<DisplaySetting value={ publicationID } />
					</p>
				</div>
				<div className="googlesitekit-settings-module__meta-item">
					<h5 className="googlesitekit-settings-module__meta-item-type">
						{ __( 'Color', 'google-site-kit' ) }
					</h5>
					<p className="googlesitekit-settings-module__meta-item-data">
						<DisplaySetting value={ colorName } />
					</p>
				</div>
			</div>
		</Fragment>
	);
}
