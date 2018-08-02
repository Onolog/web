import GpxActivityFactory from '../garmin/GpxActivityFactory';
import XMLParser from './XMLParser';

/**
 * GPXParser
 *
 * Parses a standard GPX file and produces an array of JavaScript objects
 * representing tracks and trackpoints.
 */
class GPXParser extends XMLParser {
  parse() {
    return (new GpxActivityFactory()).parseDocument(this.node);
  }
}

export default GPXParser;
