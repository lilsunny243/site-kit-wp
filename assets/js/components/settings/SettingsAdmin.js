/**
 * SettingsOverview component.
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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { MODULES_SEARCH_CONSOLE } from '../../modules/search-console/datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../modules/analytics-4/datastore/constants';
import Layout from '../layout/Layout';
import { Grid, Cell, Row } from '../../material-components';
import OptIn from '../OptIn';
import ResetButton from '../ResetButton';
import { useFeature } from '../../hooks/useFeature';
import SettingsCardKeyMetrics from './SettingsCardKeyMetrics';
import SettingsPlugin from './SettingsPlugin';
const { useSelect } = Data;

export default function SettingsAdmin() {
	const userInputEnabled = useFeature( 'userInput' );

	const showKeyMetricsSettings = useSelect(
		( select ) =>
			userInputEnabled &&
			select( CORE_MODULES ).isModuleConnected( 'analytics-4' ) &&
			select( MODULES_SEARCH_CONSOLE ).isGatheringData() === false &&
			select( MODULES_ANALYTICS_4 ).isGatheringData() === false
	);

	return (
		<Row>
			{ showKeyMetricsSettings && (
				<Cell size={ 12 }>
					<SettingsCardKeyMetrics />
				</Cell>
			) }

			<Cell size={ 12 }>
				<Layout
					title={ __( 'Plugin Status', 'google-site-kit' ) }
					header
					rounded
				>
					<div className="googlesitekit-settings-module googlesitekit-settings-module--active">
						<Grid>
							<Row>
								<Cell size={ 12 }>
									<div className="googlesitekit-settings-module__meta-items">
										<p className="googlesitekit-settings-module__status">
											{ __(
												'Site Kit is connected',
												'google-site-kit'
											) }
											<span className="googlesitekit-settings-module__status-icon googlesitekit-settings-module__status-icon--connected" />
										</p>
									</div>
								</Cell>
							</Row>
						</Grid>

						<footer className="googlesitekit-settings-module__footer">
							<Grid>
								<Row>
									<Cell size={ 12 }>
										<ResetButton />
									</Cell>
								</Row>
							</Grid>
						</footer>
					</div>
				</Layout>
			</Cell>

			<Cell size={ 12 }>
				<SettingsPlugin />
			</Cell>

			<Cell size={ 12 }>
				<Layout
					className="googlesitekit-settings-meta"
					title={ __( 'Tracking', 'google-site-kit' ) }
					header
					fill
					rounded
				>
					<div className="googlesitekit-settings-module googlesitekit-settings-module--active">
						<Grid>
							<Row>
								<Cell size={ 12 }>
									<div className="googlesitekit-settings-module__meta-items">
										<div className="googlesitekit-settings-module__meta-item googlesitekit-settings-module__meta-item--nomargin">
											<OptIn />
										</div>
									</div>
								</Cell>
							</Row>
						</Grid>
					</div>
				</Layout>
			</Cell>
		</Row>
	);
}
