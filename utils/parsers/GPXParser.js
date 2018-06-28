import GpxActivityFactory from '../../lib/garmin/activity/GpxActivityFactory';
import XMLParser from './XMLParser';

/**
 * GPXParser
 *
 * Parses a standard GPX file and produces an array of JavaScript objects
 * representing tracks and trackpoints.
 */
class GPXParser extends XMLParser {
  parse() {
    return GpxActivityFactory.parseDocument(this.node);
  }
}

module.exports = GPXParser;
