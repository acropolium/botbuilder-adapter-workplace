/**
 * We are extending FacebookAdapter from from botbuilder-adapter-facebook to use custom FacebookAPI
 */

const WorkplaceAPI = require('./workplace_api');
const { FacebookAdapter } = require('botbuilder-adapter-facebook');
const debug = require('debug')('botkit:facebook');

class WorkplaceAdapter extends FacebookAdapter {
  constructor(options) {
    super(options);
    this.name = 'Workplace Adapter';
  }

  async getAPI(activity) {
    if (this.options.access_token) {
      return new WorkplaceAPI(this.options.access_token, this.options.app_secret, this.options.api_host, this.options.api_version);
    }
    if (activity.recipient.id) {
      let pageid = activity.recipient.id;
      // if this is an echo, the page id is actually in the from field
      if (activity.channelData && activity.channelData.message && activity.channelData.message.is_echo === true) {
        pageid = activity.from.id;
      }
      const token = await this.options.getAccessTokenForPage(pageid);
      if (!token) {
        throw new Error('Missing credentials for page.');
      }
      return new WorkplaceAPI(token, this.options.app_secret, this.options.api_host, this.options.api_version);
    }
    // No API can be created, this is
    debug('Unable to create API based on activity: ', activity);
  }
}

module.exports = { WorkplaceAdapter };
