/**
 * AccountCreate component tests.
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
 * Internal dependencies
 */
import {
	createTestRegistry,
	fireEvent,
	provideModules,
	provideSiteInfo,
	provideUserAuthentication,
	provideUserInfo,
	render,
} from '../../../../../../../tests/js/test-utils';
import { mockLocation } from '../../../../../../../tests/js/mock-browser-utils';
import { mockUseInstanceID } from '../../../../../../../tests/js/mock-use-instance-id';

import {
	EDIT_SCOPE,
	MODULES_ANALYTICS,
	PROVISIONING_SCOPE,
} from '../../../datastore/constants';
import {
	GTM_SCOPE,
	MODULES_ANALYTICS_4,
} from '../../../../analytics-4/datastore/constants';
import { createCacheKey } from '../../../../../googlesitekit/api';
import { getKeys, setItem } from '../../../../../googlesitekit/api/cache';
import AccountCreate from '.';

describe( 'AccountCreate', () => {
	mockLocation();
	// Provide our own version of the `useInstanceId()` hook to avoid instability in test snapshots.
	mockUseInstanceID();

	let registry;

	beforeEach( () => {
		registry = createTestRegistry();
		provideModules( registry, [
			{
				slug: 'analytics',
				active: true,
				connected: true,
			},
			{
				slug: 'analytics-4',
				active: true,
				connected: true,
			},
		] );
		provideSiteInfo( registry );
		provideUserInfo( registry );
		provideUserAuthentication( registry, {
			grantedScopes: [ EDIT_SCOPE, PROVISIONING_SCOPE, GTM_SCOPE ],
		} );

		registry.dispatch( MODULES_ANALYTICS ).receiveGetSettings( {} );
		registry.dispatch( MODULES_ANALYTICS ).receiveGetAccounts( [] );
		registry
			.dispatch( MODULES_ANALYTICS )
			.finishResolution( 'getAccounts', [] );
	} );

	it( 'renders correctly in a loading state', async () => {
		registry
			.dispatch( MODULES_ANALYTICS )
			.invalidateResolution( 'getAccounts', [] );

		const { container, getByRole, waitForRegistry } = render(
			<AccountCreate />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);

		expect( container ).toMatchSnapshot();

		expect( getByRole( 'progressbar' ) ).toBeInTheDocument();

		// Wait for resolvers to finish to avoid an unhandled React state update.
		await waitForRegistry();
	} );

	it( 'renders correctly when data has loaded', async () => {
		const { container, getByRole, waitForRegistry } = render(
			<AccountCreate />,
			{
				registry,
				features: [ 'ga4Reporting' ],
			}
		);

		await waitForRegistry();

		expect( container ).toMatchSnapshot();

		expect(
			getByRole( 'button', { name: 'Create Account' } )
		).toBeInTheDocument();
	} );

	describe( 'when clicking on Create Account', () => {
		const accountTicketID = 'abc123';

		let getByRole, waitForRegistry;

		beforeEach( () => {
			( { getByRole, waitForRegistry } = render( <AccountCreate />, {
				registry,
				features: [ 'ga4Reporting' ],
			} ) );

			fetchMock.post(
				new RegExp(
					'^/google-site-kit/v1/modules/analytics-4/data/create-account-ticket'
				),
				{
					// eslint-disable-next-line sitekit/acronym-case
					body: { accountTicketId: accountTicketID },
					status: 200,
				}
			);
		} );

		it( 'should invalidate the module cache', async () => {
			await setItem(
				createCacheKey(
					'modules',
					'analytics-4',
					'analytics-datapoint'
				),
				'analytics-value'
			);

			const searchConsoleItemCacheKey = createCacheKey(
				'modules',
				'search-console',
				'search-console-datapoint'
			);

			await setItem( searchConsoleItemCacheKey, 'search-console-value' );

			await expect( getKeys() ).resolves.toHaveLength( 2 );

			fireEvent.click(
				getByRole( 'button', { name: 'Create Account' } )
			);

			await waitForRegistry();

			// Verify the cache is cleared for the `analytics-4` module.
			const cacheKeys = await getKeys();
			expect( cacheKeys ).toHaveLength( 1 );
			expect( cacheKeys[ 0 ] ).toContain( searchConsoleItemCacheKey );
		} );

		it( 'should navigate to the Google Analytics Terms of Service', async () => {
			fireEvent.click(
				getByRole( 'button', { name: 'Create Account' } )
			);

			await waitForRegistry();

			const accountTicketTermsOfServiceURL = registry
				.select( MODULES_ANALYTICS_4 )
				.getAccountTicketTermsOfServiceURL();

			// Verify that the URL has been navigated to.
			expect( global.location.assign ).toHaveBeenCalledWith(
				accountTicketTermsOfServiceURL
			);

			// Sanity check that the URL is correct.
			expect( accountTicketTermsOfServiceURL ).toMatch(
				new RegExp(
					`analytics.google.com.*termsofservice.*${ accountTicketID }`
				)
			);
		} );
	} );
} );
