/**
 * XmlConverter
 * Convert XML text to a DOM and back.
 */
const XmlConverter = {
  /**
   * Returns an xml document based on the string passed in
   * @param {String} fromString is the xml string to convert
   * @returns {Document}
   */
  toDocument(fromString) {
    // Internet Explorer
    if (window && window.ActiveXObject) {
      /* eslint-disable-next-line no-undef */
      const doc = new ActiveXObject('Microsoft.XMLDOM');
      doc.async = 'false';
      doc.loadXML(fromString);
      return doc;
    }

    return new DOMParser().parseFromString(fromString, 'text/xml');
  },

  /**
   * Converts a document to a string, and then returns the string
   * @param {Document} fromDocument is the DOM Object to convert
   * @returns {String}
   */
  toString(fromDocument) {
    if (window && window.ActiveXObject) {
      return fromDocument.xml;
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(fromDocument);
  },
};

export default XmlConverter;
