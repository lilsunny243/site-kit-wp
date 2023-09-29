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
import { act, fireEvent, render } from '../../../../../../tests/js/test-utils';
import {
	createTestRegistry,
	provideModules,
	provideSiteInfo,
	provideUserAuthentication,
	waitForDefaultTimeouts,
} from '../../../../../../tests/js/utils';
import { CORE_FORMS } from '../../../../googlesitekit/datastore/forms/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import { MODULES_TAGMANAGER } from '../../../tagmanager/datastore/constants';
import {
	EDIT_SCOPE,
	FORM_SETUP,
	MODULES_ANALYTICS,
	SETUP_FLOW_MODE_GA4,
	SETUP_FLOW_MODE_GA4_LEGACY,
	SETUP_FLOW_MODE_GA4_TRANSITIONAL,
	SETUP_FLOW_MODE_UA,
} from '../../datastore/constants';
import * as fixtures from '../../datastore/__fixtures__';
import * as analytics4Fixtures from '../../../analytics-4/datastore/__fixtures__';
import ga4Reporting from '../../../../feature-tours/ga4-reporting';
import { enabledFeatures } from '../../../../features';
import SetupForm from './SetupForm';

const accountID = fixtures.accountsPropertiesProfiles.accounts[ 0 ].id;

describe( 'SetupForm', () => {
	let registry;

	beforeEach( () => {
		registry = createTestRegistry();
		provideSiteInfo( registry );
		provideUserAuthentication( registry );
		provideModules( registry, [ { slug: 'analytics', active: true } ] );
	} );

	it( 'renders the form with a progress bar when GTM containers are not resolved', () => {
		provideModules( registry, [
			{ slug: 'analytics', active: true, connected: true },
			{ slug: 'tagmanager', active: true, connected: true },
		] );
		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );

		const { container, getByRole } = render( <SetupForm />, { registry } );

		expect( container ).toMatchSnapshot();

		expect( getByRole( 'progressbar' ) ).toBeInTheDocument();
	} );

	it( 'renders the form correctly when setup flow mode is UA', async () => {
		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( [], { accountID } );
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		// Verify that the setup flow mode is UA.
		expect( registry.select( MODULES_ANALYTICS ).getSetupFlowMode() ).toBe(
			SETUP_FLOW_MODE_UA
		);

		const { container, getByText, waitForRegistry } = render(
			<SetupForm />,
			{ registry }
		);
		await waitForRegistry();

		expect( container ).toMatchSnapshot();

		expect( getByText( 'Account' ) ).toBeInTheDocument();
		expect( getByText( 'Property' ) ).toBeInTheDocument();
		expect( getByText( 'View' ) ).toBeInTheDocument();
		expect( getByText( 'View Name' ) ).toBeInTheDocument();
		expect(
			getByText( 'A Google Analytics 4 property will also be created.' )
		).toBeInTheDocument();
	} );

	it( 'renders the form correctly when setup flow mode is GA4', async () => {
		enabledFeatures.add( 'ga4Reporting' );

		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( [], { accountID } );
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		// Verify that the setup flow mode is GA4.
		expect( registry.select( MODULES_ANALYTICS ).getSetupFlowMode() ).toBe(
			SETUP_FLOW_MODE_GA4
		);

		const { container, getByText, waitForRegistry } = render(
			<SetupForm />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);
		await waitForRegistry();

		expect( container ).toMatchSnapshot();

		expect( getByText( 'Account' ) ).toBeInTheDocument();
		expect( getByText( 'Property' ) ).toBeInTheDocument();
		expect( getByText( 'Web Data Stream' ) ).toBeInTheDocument();
	} );

	it( 'renders the form correctly when setup flow mode is GA4 Legacy', async () => {
		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( analytics4Fixtures.properties, {
				accountID,
			} );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetWebDataStreamsBatch(
				analytics4Fixtures.webDataStreamsBatch,
				{
					propertyIDs: Object.keys(
						analytics4Fixtures.webDataStreamsBatch
					),
				}
			);
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		// Verify that the setup flow mode is GA4 Legacy.
		expect( registry.select( MODULES_ANALYTICS ).getSetupFlowMode() ).toBe(
			SETUP_FLOW_MODE_GA4_LEGACY
		);

		const { container, getByText, waitForRegistry } = render(
			<SetupForm />,
			{
				registry,
			}
		);
		await waitForRegistry();

		expect( container ).toMatchSnapshot();

		expect( getByText( 'Account' ) ).toBeInTheDocument();
		expect( getByText( 'Property' ) ).toBeInTheDocument();
		expect( getByText( 'Web Data Stream' ) ).toBeInTheDocument();
		expect(
			getByText(
				'An associated Universal Analytics property will also be created.'
			)
		).toBeInTheDocument();
	} );

	it( 'renders the form correctly when setup flow mode is GA4 Transitional', async () => {
		const propertyID =
			fixtures.accountsPropertiesProfiles.properties[ 0 ].id;

		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties(
				fixtures.accountsPropertiesProfiles.properties,
				{ accountID }
			);
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( analytics4Fixtures.properties, {
				accountID,
			} );
		registry.dispatch( MODULES_ANALYTICS ).receiveGetProfiles( [], {
			accountID,
			propertyID,
		} );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetWebDataStreamsBatch(
				analytics4Fixtures.webDataStreamsBatch,
				{
					propertyIDs: Object.keys(
						analytics4Fixtures.webDataStreamsBatch
					),
				}
			);
		// TODO: This call to `selectAccount()` is deliberately _not_ awaited in order to avoid a bug resulting from Redux state mutation in the `PropertySelect` component.
		// This should be revisited once the bug is fixed at which point it can be awaited for consistency with the other tests.
		// See https://github.com/google/site-kit-wp/issues/7220.
		registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );
		await registry
			.dispatch( MODULES_ANALYTICS )
			.selectProperty( propertyID );

		// Verify that the setup flow mode is GA4 Transitional.
		expect( registry.select( MODULES_ANALYTICS ).getSetupFlowMode() ).toBe(
			SETUP_FLOW_MODE_GA4_TRANSITIONAL
		);

		const { container, findAllByText, getByText, waitForRegistry } = render(
			<SetupForm />,
			{
				registry,
			}
		);
		await waitForRegistry();

		// An additional wait is required in order for all resolvers to finish and the component to update.
		await act( async () => {
			await waitForDefaultTimeouts();
		} );

		expect( container ).toMatchSnapshot();

		expect( getByText( 'Account' ) ).toBeInTheDocument();

		const propertyElements = await findAllByText( 'Property' );
		expect( propertyElements.length ).toBe( 2 );

		expect( getByText( 'View' ) ).toBeInTheDocument();
		expect( getByText( 'View Name' ) ).toBeInTheDocument();
		expect( getByText( 'Web Data Stream' ) ).toBeInTheDocument();
		expect(
			getByText(
				'You need to connect the Universal Analytics property that’s associated with this Google Analytics 4 property.'
			)
		).toBeInTheDocument();
	} );

	it( 'submits the form upon pressing the CTA', async () => {
		enabledFeatures.add( 'ga4Reporting' );

		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( analytics4Fixtures.properties, {
				accountID,
			} );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetWebDataStreamsBatch(
				analytics4Fixtures.webDataStreamsBatch,
				{
					propertyIDs: Object.keys(
						analytics4Fixtures.webDataStreamsBatch
					),
				}
			);
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		const finishSetup = jest.fn();
		const { getByRole, waitForRegistry } = render(
			<SetupForm finishSetup={ finishSetup } />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);
		await waitForRegistry();

		act( () => {
			// It doesn't seem possible to show the dropdown menu within the test by clicking on the dropdown in the usual way.
			// Therefore, we simulate the click on the dropdown menu item directly, despite it being hidden.
			fireEvent.click(
				getByRole( 'menuitem', {
					name: /Test GA4 Property/i,
					hidden: true,
				} )
			);
		} );

		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedTours( [ ga4Reporting.slug ] );

		const updateAnalyticsSettingsRegexp = new RegExp(
			'/analytics/data/settings'
		);

		const updateAnalytics4SettingsRegexp = new RegExp(
			'/analytics-4/data/settings'
		);

		fetchMock.post( updateAnalyticsSettingsRegexp, {
			status: 200,
			body: {},
		} );

		fetchMock.post( updateAnalytics4SettingsRegexp, {
			status: 200,
			body: {},
		} );

		act( () => {
			fireEvent.click(
				getByRole( 'button', { name: /Configure Analytics/i } )
			);
		} );

		await waitForRegistry();

		// An additional wait is required to allow the finishSetup callback to be invoked.
		await waitForDefaultTimeouts();

		expect( fetchMock ).toHaveFetchedTimes(
			1,
			updateAnalyticsSettingsRegexp
		);
		expect( fetchMock ).toHaveFetchedTimes(
			1,
			updateAnalytics4SettingsRegexp
		);

		expect( finishSetup ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'auto-submits the form', async () => {
		enabledFeatures.add( 'ga4Reporting' );

		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry.dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );
		registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( null );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAccountSummaries( analytics4Fixtures.accountSummaries );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetWebDataStreamsBatch(
				analytics4Fixtures.webDataStreamsBatch,
				{
					propertyIDs: Object.keys(
						analytics4Fixtures.webDataStreamsBatch
					),
				}
			);
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		// Simulate an auto-submit case where the user is returning to the page
		// after granting extra scopes necessary to submit.
		// In this situation, the autoSubmit is set before the user goes to oAuth,
		// store state is snapshotted, and then restored upon returning.
		registry
			.dispatch( CORE_FORMS )
			.setValues( FORM_SETUP, { autoSubmit: true } );
		provideUserAuthentication( registry, {
			grantedScopes: [ EDIT_SCOPE ],
		} );

		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedTours( [ ga4Reporting.slug ] );

		const createPropertyRegexp = new RegExp(
			'/analytics-4/data/create-property'
		);

		const createWebDataStreamRegexp = new RegExp(
			'/analytics-4/data/create-webdatastream'
		);

		const updateAnalyticsSettingsRegexp = new RegExp(
			'/analytics/data/settings'
		);

		const updateAnalytics4SettingsRegexp = new RegExp(
			'/analytics-4/data/settings'
		);

		const getWebDataStreamsBatchRegexp = new RegExp(
			'/analytics-4/data/webdatastreams-batch'
		);

		fetchMock.post( createPropertyRegexp, {
			status: 200,
			body: analytics4Fixtures.properties[ 0 ],
		} );

		fetchMock.post( createWebDataStreamRegexp, {
			status: 200,
			body: analytics4Fixtures.webDataStreams[ 0 ],
		} );

		fetchMock.post( updateAnalyticsSettingsRegexp, {
			status: 200,
			body: {},
		} );

		fetchMock.post( updateAnalytics4SettingsRegexp, {
			status: 200,
			body: {},
		} );

		fetchMock.get( getWebDataStreamsBatchRegexp, {
			status: 200,
			body: [],
		} );

		const finishSetup = jest.fn();
		const { getByRole, waitForRegistry } = render(
			<SetupForm finishSetup={ finishSetup } />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);
		await waitForRegistry();

		// Ensure the form rendered successfully.
		expect(
			getByRole( 'button', { name: /Configure Analytics/i } )
		).toBeInTheDocument();

		await waitForRegistry();

		// An additional wait is required in order for all resolvers to finish.
		await act( async () => {
			await waitForDefaultTimeouts();
		} );

		expect( fetchMock ).toHaveFetchedTimes( 1, createPropertyRegexp );
		expect( fetchMock ).toHaveFetchedTimes( 1, createWebDataStreamRegexp );
		expect( fetchMock ).toHaveFetchedTimes(
			1,
			updateAnalyticsSettingsRegexp
		);
		expect( fetchMock ).toHaveFetchedTimes(
			1,
			updateAnalytics4SettingsRegexp
		);
		expect( fetchMock ).toHaveFetchedTimes(
			1,
			getWebDataStreamsBatchRegexp
		);

		expect( finishSetup ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'auto-submits the form only once in the case of an error', async () => {
		enabledFeatures.add( 'ga4Reporting' );

		registry.dispatch( MODULES_ANALYTICS ).setSettings( {} );
		registry.dispatch( MODULES_TAGMANAGER ).setSettings( {} );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );
		registry
			.dispatch( MODULES_ANALYTICS )
			.receiveGetProperties( [], { accountID } );
		registry.dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );
		registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( null );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAccountSummaries( analytics4Fixtures.accountSummaries );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetProperties( [], { accountID } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetWebDataStreamsBatch(
				analytics4Fixtures.webDataStreamsBatch,
				{
					propertyIDs: Object.keys(
						analytics4Fixtures.webDataStreamsBatch
					),
				}
			);
		await registry.dispatch( MODULES_ANALYTICS ).selectAccount( accountID );

		// Simulate an auto-submit case where the user is returning to the page
		// after granting extra scopes necessary to submit.
		// In this situation, the autoSubmit is set before the user goes to oAuth,
		// store state is snapshotted, and then restored upon returning.
		registry
			.dispatch( CORE_FORMS )
			.setValues( FORM_SETUP, { autoSubmit: true } );
		provideUserAuthentication( registry, {
			grantedScopes: [ EDIT_SCOPE ],
		} );

		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedTours( [ ga4Reporting.slug ] );

		const createPropertyRegexp = new RegExp(
			'/analytics-4/data/create-property'
		);

		fetchMock.post( createPropertyRegexp, {
			status: 403,
			body: {
				code: 403,
				error: 'Insufficient permissions',
			},
		} );

		const finishSetup = jest.fn();
		const { getByRole, waitForRegistry } = render(
			<SetupForm finishSetup={ finishSetup } />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);
		await waitForRegistry();

		// Ensure the form rendered successfully.
		expect(
			getByRole( 'button', { name: /Configure Analytics/i } )
		).toBeInTheDocument();

		// While not strictly needed, add waits to match the successful auto-submit test case to help avoid a false positive result.
		await waitForRegistry();
		await act( async () => {
			await waitForDefaultTimeouts();
		} );

		// Create property should have only been called once.
		expect( fetchMock ).toHaveFetchedTimes( 1, createPropertyRegexp );
		// Setup was not successful, so the finish function should not be called.
		expect( finishSetup ).not.toHaveBeenCalled();
		// Expect a console error due to the API error (otherwise this test will fail).
		expect( console ).toHaveErrored();
	} );
} );
