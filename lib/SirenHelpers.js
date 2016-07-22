import Client from './Client';
import Uri from 'urijs';

class SirenHelpers {
	constructor(Siren) {
		this.Siren = Siren;
	}

	/**
	 * Follows the Siren model's link by the provided rel.
	 *
	 * @param  {String} rel  how the requested link is related to the result siren we are following.
	 * @return {Promise}     Promise which resolves to a superagent response
	 */
	follow(rel) {
		return (res) => {
			const link = res.body.findLinkByRel(rel)
				|| res.body.linkedEntitiesByRel(rel).map(item => item.href).first()
				|| res.body.embeddedEntitiesByRel(rel).map(item => item.entity.selfLink).first();

			if (!link) {
				throw new Error('No link found for provided rel', {rel});
			}

			return typeof link === 'string' ? this.Siren.get(link) : link.follow();
		};
	}

	/**
	 * Performs the action identified by the provided actionName using the provided data.
	 *
	 * @param  {String} name       The name that identifies the action to take
	 * @param  {Object=} data      The data to send on the action
	 * @return {Promise}           Promise which resolves to a superagent response
	 */
	performAction(name, data) {
		return (res) => {
			const action = res.body.findActionByName(name);

			if (!action) {
				throw new Error('No action found for the provided name', {name});
			}

			return action.perform(data);
		};
	}

	/**
	 * Processes the provided url and computes the absolute URL provided
	 * the url and optional baseUrl.
	 *
	 * @param  {String} url          The URL to process
	 * @param  {String} [baseUrl]    Optional base URL to compute the absolute URL relative to.
	 * @return {String}              Absolute URL
	 */
	static processUrl(url, baseUrl) {
		if (url && url.length > 0) {
			let uri = new Uri(url);

			if (baseUrl) {
				uri = uri.absoluteTo(baseUrl);
			}

			return uri.toString();
		}

		return null;
	}
}

export default SirenHelpers;
