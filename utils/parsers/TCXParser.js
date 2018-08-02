import invariant from 'invariant';

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
    invariant(
      activityNodes.length,
      'Error: Unable to parse TCX document.'
    );

    const activities = [];
    for (let ii = 0; ii < activityNodes.length; ii++) {
      const activityNode = new TCXActivityParser(activityNodes[ii]);
      activities.push(activityNode.parse());
    }

    return activities;
  }
}

export default TCXParser;
