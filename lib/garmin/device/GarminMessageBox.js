/**
 * Encapsulates the data to display a message box to the user when the plug-in
 * is waiting for feedback.
 *
 * @class Garmin.MessageBox
 * @constructor 
 */
define(function() {

  var GarminMessageBox = function(type, text) {
    this.type = type;
    this.text = text;
    this.buttons = new Array();
  };

  GarminMessageBox.prototype = {
    /**
     * Get the type of the message box
     * @type String
     */
  	getType: function() {
  		return this.type;
  	},
  
      /** Get the text entry for the message box
       * @type String
       */	 
  	getText: function() {
  		return this.text;
  	},
  
      /** Get the text entry for the message box
       */	 
  	addButton: function(caption, value) {
  		this.buttons.push({caption: caption, value: value});
  	},
  
      /** Get the buttons for the message box
       * @type Array
       */	 
  	getButtons: function() {
  		return this.buttons;
  	},
  	
  	getButtonValue: function(caption) {
  		for(var i=0; i< this.buttons.length; i++) {
  			if(this.buttons[i].caption == caption) {
  				return this.buttons[i].value;
  			}
  		}
  		return null;
  	},
  
      /**
  	 * @type String
       */	 
  	toString: function() {
  		return this.getText();
  	}
  };

  return GarminMessageBox;
});