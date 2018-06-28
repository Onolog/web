/**
 * A place-holder for Garmin Device Data Type information
 * @class GarminDeviceDataType
 *
 * @constructor 
 * @param {String} typeName for the data type
 * @param {String} extension file extension for the data type
 */
define(function() {

  var GarminDeviceDataType = function(typeName, fileExtension) {
    this.typeName = typeName;
    this.fileExtension = fileExtension;
    this.readAccess = false;
    this.writeAccess = false;
    this.filePath = null;
    this.readFilePath = null;
    this.writeFilePath = null;
    this.identifier = null;
  };

  GarminDeviceDataType.prototype = {
  	/**
  	 * @type String
  	 * @return The type name of this data type
  	 */
  	getTypeName: function() {
  		return this.typeName;
  	},
  	
  	/** 
  	 * @deprecated
  	 * @type String
  	 * @return The type/display name of this data type
  	 */
  	getDisplayName: function() {
  		return this.getTypeName();
  	},
  	
  	/**
  	 * @type String
  	 * @return The file extension of this data type
  	 */
  	getFileExtension: function() {
  		return this.fileExtension;
  	},
  	
  	/**
  	 * @type String
  	 * @return The file path for this data type
  	 */
  	getFilePath: function() {
  		return this.filePath;
  	},
  	
  	/**
  	 * @param filePath - the filepath for this datatype
  	 */
  	setFilePath: function(filePath) {
  		this.filePath = filePath;
  	},
  	
  	/**
       * @param readFilePath - the readFilePath for this datatype
       */
  	getReadFilePath: function() {
  	   return this.readFilePath;	
  	},
  	
  	/**
  	 * @type String
       * @return The read file path for this data type
       */
  	setReadFilePath: function(readFilePath) {
  		this.readFilePath = readFilePath;
  	},
  	
  	/**
     * @param writeFilePath - the readFilePath for this datatype
     */
    getWriteFilePath: function() {
       return this.writeFilePath;    
    },
    
    /**
     * @type String
     * @return The write file path for this data type
     */
    setWriteFilePath: function(writeFilePath) {
      this.writeFilePath = writeFilePath;
    },
  	
  	/**
  	 * @type String
  	 * @return The identifier for this data type
  	 */
  	getIdentifier: function() {
  		return this.identifier;
  	},
  	
  	/**
  	 * @param identifier- the identifier for this datatype
  	 */
  	setIdentifier: function(identifier) {
  		this.identifier = identifier;
  	},
  	
  	/**
  	 * @param readAccess True == has read access
  	 */
  	setReadAccess: function(readAccess) {
  		this.readAccess = readAccess;
  	},
  	
  	/** Returns value indicating if the device supports read access for this file type
  	 * @type Boolean
  	 * @return supports read access for this file type
  	 */
  	hasReadAccess: function() {
  		return this.readAccess;
  	},
  	
  	/**
  	 * @param {Boolean} has write access
  	 */	
  	setWriteAccess: function(writeAccess) {
  		this.writeAccess = writeAccess;
  	},
  	
  	/** return the value indicating if the device supports write access for this file type
  	 * @type Boolean
  	 * @return supports write access for this file type
  	 */
  	hasWriteAccess: function() {
  		return this.writeAccess;
  	}	
  };

  return GarminDeviceDataType;
});
