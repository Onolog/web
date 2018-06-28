/**
 * XmlConverter
 * Convert XML text to a DOM and back.
 */
var XmlConverter = {
  /**
   * Returns an xml document based on the string passed in
   * @param {String} fromString is the xml string to convert
   * @returns {Document}
   */
  toDocument: function(fromString) {
    // Internet Explorer
    if (window.ActiveXObject) {
      var doc = new ActiveXObject('Microsoft.XMLDOM');
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
  toString: function(fromDocument) {
  	if (window.ActiveXObject) {
  		return fromDocument.xml
  	}

		var serializer = new XMLSerializer();
		return serializer.serializeToString(fromDocument);
  }
};

module.exports = XmlConverter;
