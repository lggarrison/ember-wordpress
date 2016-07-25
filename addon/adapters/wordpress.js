import DS from 'ember-data';
import config from 'ember-get-config';

// The WP API requires a rest adapter.
export default DS.RESTAdapter.extend({
  host: config.wordpressHost,
  // This is the default namespace for WP API v2.
  namespace: 'wp-json/wp/v2',

  handleResponse(status, headers, payload, requestData) {
    // Wordpress sends meta data (useful for pagination) in GET requests headers.
    // Here we move it to a `meta` property which Ember expects.

    let newPayload = {};
    newPayload.data = payload;

    if (payload) {
      const meta = {
        total: headers['X-WP-Total'],
        totalPages: headers['X-WP-TotalPages']
      };
      newPayload.meta = meta;
    }

    payload = newPayload;
    return this._super(status, headers, payload, requestData);
  }
});
