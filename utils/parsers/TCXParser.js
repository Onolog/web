import {forEach} from 'lodash';

import TCXActivityParser from './TCXActivityParser';
import XMLParser from './XMLParser';

/**
 * TCXParser
 *
 * Parses a TCX file and returns an array of JavaScript objects
 * representing Garmin activities.
 */
class TCXParser extends XMLParser {
  parse() {
    let activityNodes = this.getByTagName('Activity');

    // TODO: Should this be an error or just an empty array/object?
    if (!activityNodes.length) {
      throw new Error('Error: Unable to parse TCX document.');
    }

    let activities = [];
    forEach(activityNodes, (activityNode) => {
      let activity = (new TCXActivityParser(activityNode)).parse();
      activities.push(activity);
    });
    return activities;
  }
}

module.exports = TCXParser;
