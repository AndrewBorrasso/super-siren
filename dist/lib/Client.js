'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var request = require('superagent-promise')(_superagent2['default'], _bluebird2['default']);

var globalHeaders = new _immutable2['default'].Map();

/**
 * HTTP client used by the Super-Siren library.  Library utilized [superaget](https://github.com/visionmedia/superagent)
 * for all requests.
 */

var Client = (function () {
	function Client() {
		_classCallCheck(this, Client);
	}

	_createClass(Client, null, [{
		key: 'get',

		/**
   * Creates a superagent HTTP get operation
   *
   * @param {String} href The URL to perform an HTTP get against.
   * @return {superagent-promise} superagent get request
   */
		value: function get(href) {
			var req = request.get(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'put',
		value: function put(href) {
			var req = request.put(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'post',
		value: function post(href) {
			var req = request.post(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'del',
		value: function del(href) {
			var req = request.del(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'action',
		value: function action(method, href) {
			method = (method || 'get').toLowerCase();

			if (method === 'delete') {
				method = 'del';
			}

			var req = request[method](href);
			addHeaders(req);

			return req;
		}

		/**
   * Registers a content type parser with all client instances.
   *
   * @param {String} contentType     content-type which should be parsed with the provided function
   *                                 whenever a response is received with this content type.
   * @param {Function} parseFunction Function to call in order to return response body when response
   *                                 is encoded with the provided contentType.
   * @returns {undefined}
   */
	}, {
		key: 'addParser',
		value: function addParser(contentType, parseFunction) {
			_superagent2['default'].parse[contentType] = function (res, done) {
				//if res is a string, that means we're likely in a browser environment
				//and have only been provided the string to parse.
				if (typeof res === 'string') {
					return parseFunction(res);
				}

				//if we made it this far it's likely Node and have to do more work to parse

				//TODO: cannot assume http
				var baseUrl = null;

				if (res.req && res.req._headers && res.req._headers.host) {
					baseUrl = new _urijs2['default']({ protocol: 'http', hostname: res.req._headers.host }).toString();
					baseUrl = new _urijs2['default'](res.req.path).absoluteTo(baseUrl).toString();
				}

				res.text = '';
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					res.text += chunk;
				});
				res.on('end', function () {
					var err = null;
					var body = null;

					try {
						var text = res.text && res.text.replace(/^\s*|\s*$/g, '');
						body = text && parseFunction(text, baseUrl);
					} catch (e) {
						err = e;
					} finally {
						done(err, body);
					}
				});
			};
		}

		/**
   * Returns a Map of current global headers that are added
   * for all clients.
   *
   * @return {Immutable.Map} Immutable map of all currently registered headers
   */
	}, {
		key: 'addHeader',

		/**
   * Registers a global header to be used by all client instances.
   *
   * @param {String} header The header attribute to set
   * @param {String} value The header value to set
   * @returns {undefined}
   */
		value: function addHeader(header, value) {
			globalHeaders = globalHeaders.set(header, value);
		}

		/**
   * Remves a previously registered global header.
   *
   * @param  {String} header The header attribute to remove
   * @returns {undefined}
   */
	}, {
		key: 'removeHeader',
		value: function removeHeader(header) {
			globalHeaders = globalHeaders['delete'](header);
		}
	}, {
		key: 'globalHeaders',
		get: function get() {
			return globalHeaders;
		}
	}]);

	return Client;
})();

function addHeaders(req) {
	globalHeaders.forEach(function (value, key) {
		req.set(key, value);
	});
}

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=Client.js.map
