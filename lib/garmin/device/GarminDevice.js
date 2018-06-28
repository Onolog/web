/** Copyright &copy; 2007-2010 Garmin Ltd. or its subsidiaries.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License')
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * @fileoverview GarminDevice A place-holder for Garmin device information. <br/>
 * Source: 
 * <a href="http://developer.garmin.com/web/communicator-api/garmin/device/GarminDevice.js">Hosted Distribution</a> &nbsp;
 * <a href="https://svn.garmindeveloper.com/web/trunk/communicator/communicator-api/src/main/webapp/garmin/device/GarminDevice.js">Source Control</a><br/>
 * @version 1.9
 */
/** A place-holder for Garmin device information.
 * @class GarminDevice
 *
 * @constructor 
 * @param {String} displayName for the device
 * @param {Number} number of the model
 */
define([], function() {

  var GarminDevice = function(displayName, number) {
    this.displayName = displayName;
    this.number = number;
    this.parentNumber = -1;
    this.parent = null;
    this.children = [];
    
    this.partNumber = null;
    this.softwareVersion = null;
    this.description = null;
    this.id = null;
    this.fileBased = false;
    this.dataTypes = {};
  };

  GarminDevice.prototype = {
  	/** The display name of this device.
  	 * @type String
  	 * @return display name
  	 * @member GarminDevice
  	 */
  	getDisplayName: function() {
  		return this.displayName;
  	},
  	
  	/** The device number that the plug-in uses to identify this device
  	 * @type Number
  	 * @return device number
  	 */
  	getNumber: function() {
  		return this.number;
  	},
  	
  	/** The parent device's number. -1 if this device has no parent.
  	 * @returns {Number} parent device number
  	 */
  	getParentNumber: function() {
  		return this.parentNumber;
  	},
  
  	/** Set parent device number
  	 * @param {Number} parent device number
  	 */
  	setParentNumber: function(aNumber) {
  		this.parentNumber = aNumber;
  	},
  
  	/** The parent device object, null if this device has no parent.
  	 * @returns {GarminDevice} parent device
  	 */
  	getParent: function() {
  		return this.parentDevice;
  	},
  
  	/** Set parent device
  	 * @param {GarminDevice} parent device object
  	 */
  	setParent: function(aDevice) {
  		this.parentDevice = aDevice;
  	},
  
  	/** Add a child device
  	 * @param {GarminDevice} child object
  	 */
  	addChild: function(aDevice) {
  		this.children.push(aDevice);
  	},
      
  	/**
  	 * The array of child devices
  	 * @returns {Array} of GarminDevice objects
  	 */
    getChildren: function() {
      return this.children;
    },
  
  	/** Set part number of device
  	 * @param {String} part number
  	 */
  	setPartNumber: function(partNumber) {
  		this.partNumber = partNumber;
  	},
  
  	/** The part number of the device
  	 * @type String
  	 * @return The part number of the device
  	 */
  	getPartNumber: function() {
  		return this.partNumber;
  	},
  
  	/** Software version installed on device
  	 * @param {String} GarminDevice
  	 */
  	setSoftwareVersion: function(softwareVersion) {
  		this.softwareVersion = softwareVersion;
  	},
  
  	/** The software version currently on the device
  	 * @type String
  	 * @return software version
  	 */
  	getSoftwareVersion: function() {
  		return this.softwareVersion;
  	},
  
  	/** Set description of the device
  	 * @param {String} device description
  	 */
  	setDescription: function(description) {
  		this.description = description;
  	},
  
  	/** A description of the device.  This usually represents the model name of the device
  	 * and includes the software version, i.e. "Forerunner 405  Jun 27 2008 2.17"
  	 * In the GarminDevice XML, this is Model > Description.
  	 * @type String
  	 * @return device description
  	 */
  	getDescription: function() {
  		return this.description;
  	},
  
  	/** set device id
  	 * @param {String} device id
  	 */
  	setId: function(id) {
  		this.id = id;
  	},
  
  	/** The device id
  	 * @type String
  	 * @return The device id
  	 */
  	getId: function() {
  		return this.id;
  	},
  	
  	/** Adds a data type to the list of data types supported by this device
  	 * @param dataType A DeviceDataType object containing information about the data type being added
  	 */
  	addDeviceDataType: function(dataType) {
  		var newDataType = {};
  		newDataType.set(dataType.getTypeName(), dataType);
  		this.dataTypes.update(newDataType);	
  	},
  
  	/** Returns a specific DeviceDataType object
  	 * @type GarminDeviceDataType
  	 * @return The DeviceDataType object containing the specified extension
  	 * @param extension The file extension of the data type you are trying to get
  	 */	
  	getDeviceDataType: function(extension) {
      return this.dataTypes.get(extension);
  	},
  
  	/** Returns a hash containing all DeviceDataType objects
  	 * @type Hash
  	 * @return all DeviceDataType objects
  	 */	
  	getDeviceDataTypes: function() {
  		return this.dataTypes;
  	},
  
  	/**	Returns true if the device has read support for the file type
  	 * @param {String} extension The extension of the file type you are checking for support
  	 * @type Boolean
  	 * @return read support for the file type
  	 */	
  	supportDeviceDataTypeRead: function(extension) {
  		var dataType = this.getDeviceDataType(extension);
  		if (dataType != null && dataType.hasReadAccess()) {
  			return true;
  		} else {
  			return false;
  		}	
  	},
  	
  	/** Check if device has write support for the file type.
  	 * @param {String} extension The extension of the file type you are checking for support
  	 * @type Boolean
  	 * @return True if write support 
  	 */		
  	supportDeviceDataTypeWrite: function(extension) {
  		var dataType = this.getDeviceDataType(extension);
  		if (dataType != null && dataType.hasWriteAccess()) {
  			return true;
  		} else {
  			return false;
  		}			
  	},
  
  	/**
  	 * Set if device is a File-based device.
       * @param {Boolean} set if device is file based
       */
  	setIsFileBased: function(aBool) {
  	   this.fileBased = aBool;	
  	},
  
  	/**
  	 * Check if device is a File-based device.<br\>
  	 * Will return false for all devices on plug-in versions prior to 2.8.1.0 <br\>
  	 * @see GarminDevicePlugin#isDeviceFileBased
       * @returns {Boolean} true if device is file based
       */
  	isFileBased: function() {
  	   return this.fileBased;	
  	},
  	
  	toString: function() {
  		return "Device["+this.getDisplayName()+", "+this.getDescription()+", "+this.getNumber()+"]";
  	}
  	
  };

  return GarminDevice;

});
