import { head } from 'lodash';

/**
 * XMLParser
 *
 * Base parser for parsing XML activity files, like TCX or GPX.
 */
class XMLParser {
  constructor(nodeOrString) {
    let node = nodeOrString;

    // Convert to a document if we're working with a string.
    if (typeof node === 'string') {
      node = this.toDocument(node);
    }

    this.node = node;
  }

  /**
   * Returns the value contained in single node, with the assumption that the
   * node only contains a single value and no child nodes.
   *
   * Example:
   *
   *    var node =
   *      <ParentNode>
   *        <ChildNode>SomeValue</ChildNode>
   *      </ParentNode>;
   *
   *    this.getTagValue('ChildNode', node); // 'SomeValue'
   */
  static getTagValue(tagName, parentNode) {
    if (parentNode) {
      const childNode = head(parentNode.getElementsByTagName(tagName));
      return (childNode && childNode.innerHTML) || 0;
    }
    return 0;
  }

  /**
   * Returns an xml document based on the string passed in
   * @param {String} fromString is the xml string to convert
   * @returns {Document}
   */
  static toDocument(fromString) {
    // Internet Explorer
    if (window.ActiveXObject) {
      const { ActiveXObject } = window;
      const doc = new ActiveXObject('Microsoft.XMLDOM');
      doc.async = 'false';
      doc.loadXML(fromString);
      return doc;
    }

    return new DOMParser().parseFromString(fromString, 'text/xml');
  }

  /**
   * Converts a document to a string, and then returns the string
   * @param {Document} fromDocument is the DOM Object to convert
   * @returns {String}
   */
  static toString(fromDocument) {
    if (window.ActiveXObject) {
      return fromDocument.xml;
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(fromDocument);
  }

  /**
   * Convenience method.
   */
  getByTagName(tagName) {
    return this.node.getElementsByTagName(tagName);
  }

  getAttribute(attributeName) {
    return this.node.getAttribute(attributeName);
  }
}

export default XMLParser;
