/* eslint-disable class-methods-use-this */

import invariant from 'invariant';

import GPXParser from './GPXParser';
import TCXParser from './TCXParser';

const FILE_TYPES = {
  GPX: 'gpx',
  TCX: 'tcx',
};

function getFileType(file) {
  invariant(
    typeof file === 'string',
    'FileParser: Invalid format. File must be a string.'
  );

  if (file.indexOf('gpx') !== -1) {
    return FILE_TYPES.GPX;
  }

  if (file.indexOf('TrainingCenterDatabase') !== -1) {
    return FILE_TYPES.TCX;
  }
}

/**
 * FileParser
 *
 * High-level parser that interprets the file or string being passed in and
 * delegates to the appropriate sub-parser.
 */
class FileParser {
  parse(file) {
    let parser;
    const type = getFileType(file);

    switch (type) {
      case FILE_TYPES.GPX:
        parser = new GPXParser(file);
        break;
      case FILE_TYPES.TCX:
        parser = new TCXParser(file);
        break;
      default:
        // TODO: Handle other file types, eg: .fit, .csv
        break;
    }

    return parser && parser.parse();
  }
}

export default FileParser;
