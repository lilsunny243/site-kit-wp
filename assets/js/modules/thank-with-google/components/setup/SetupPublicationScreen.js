/**
 * Thank with Google Setup Publication Screen component.
 *
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 *
 * WordPress dependencies
 */
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Grid, Row, Cell } from '../../../../material-components';
import SetupHeader from './SetupHeader';

const ThankWithGoogleSetup = lazy( () =>
	import( '../../../../../svg/graphics/thank-with-google-setup.svg' )
);

export default function SetupPublicationScreen( props ) {
	const { title, description, children } = props;

	return (
		<Grid collapsed>
			<Row>
				<Cell>
					<SetupHeader />
				</Cell>
				<Cell>
					<Row>
						<Cell
							mdSize={ 6 }
							lgSize={ 6 }
							className="googlesitekit-setup__icon"
							mdOrder={ 2 }
							lgOrder={ 2 }
						>
							<Suspense fallback={ <div /> }>
								<ThankWithGoogleSetup
									width={ 391 }
									height={ 222 }
								/>
							</Suspense>
						</Cell>
						<Cell mdSize={ 6 } lgSize={ 6 }>
							<div className="googlesitekit-setup-module__publication-screen">
								<h3 className="googlesitekit-heading-3 googlesitekit-setup-module__title">
									{ title }
								</h3>
								<p>{ description }</p>
							</div>

							{ children }
						</Cell>
					</Row>
				</Cell>
			</Row>
		</Grid>
	);
}

SetupPublicationScreen.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.node,
};
