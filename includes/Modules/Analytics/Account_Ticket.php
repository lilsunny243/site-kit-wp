<?php
/**
 * Class Google\Site_Kit\Modules\Analytics\Account_Ticket
 *
 * @package   Google\Site_Kit
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics;

/**
 * Class representing an account ticket for Analytics account provisioning with associated parameters.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Account_Ticket {

	/**
	 * Account ticket ID.
	 *
	 * @since n.e.x.t
	 * @var string
	 */
	protected $id;

	/**
	 * Property name.
	 *
	 * @since n.e.x.t
	 * @var string
	 */
	protected $property_name;

	/**
	 * Data stream name.
	 *
	 * @since n.e.x.t
	 * @var string
	 */
	protected $data_stream_name;

	/**
	 * Timezone.
	 *
	 * @since n.e.x.t
	 * @var string
	 */
	protected $timezone;

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param array $data Data to hydrate properties with.
	 */
	public function __construct( $data = null ) {
		if ( ! is_array( $data ) ) {
			return;
		}
		foreach ( $data as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
				$this->{"set_$key"}( $value );
			}
		}
	}

	/**
	 * Gets the account ticket ID.
	 *
	 * @since n.e.x.t
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Sets the account ticket ID.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $id Account ticket ID.
	 */
	public function set_id( $id ) {
		$this->id = (string) $id;
	}

	/**
	 * Gets the property name.
	 *
	 * @since n.e.x.t
	 *
	 * @return string
	 */
	public function get_property_name() {
		return $this->property_name;
	}

	/**
	 * Sets the property name.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $property_name Property name.
	 */
	public function set_property_name( $property_name ) {
		$this->property_name = (string) $property_name;
	}

	/**
	 * Gets the data stream name.
	 *
	 * @since n.e.x.t
	 *
	 * @return string
	 */
	public function get_data_stream_name() {
		return $this->data_stream_name;
	}

	/**
	 * Sets the data stream name.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $data_stream_name Data stream name.
	 */
	public function set_data_stream_name( $data_stream_name ) {
		$this->data_stream_name = (string) $data_stream_name;
	}

	/**
	 * Gets the timezone.
	 *
	 * @since n.e.x.t
	 *
	 * @return string
	 */
	public function get_timezone() {
		return $this->timezone;
	}

	/**
	 * Sets the timezone.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $timezone Timezone.
	 */
	public function set_timezone( $timezone ) {
		$this->timezone = (string) $timezone;
	}

	/**
	 * Gets the array representation of the instance values.
	 *
	 * @since n.e.x.t
	 *
	 * @return array
	 */
	public function to_array() {
		return get_object_vars( $this );
	}
}
