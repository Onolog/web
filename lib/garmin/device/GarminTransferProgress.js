/**
 * Encapsulates the data provided by the device for the current process' progress.
 * Use this to relay progress information to the user.
 * @class Garmin.TransferProgress
 * @constructor 
 */
define(function() {

  var GarminTransferProgress = function(title) {
    this.title = title;
    this.text = new Array();
    this.percentage = null;
  };

  GarminTransferProgress.prototype = {  	
  	addText: function(textString) {
  		this.text.push(textString);
  	},
  
      /** Get all the text entries for the transfer
       * @type Array
       */	 
  	getText: function() {
  		return this.text;
  	},
  
      /** Get the title for the transfer
       * @type String
       */	 
  	getTitle: function() {
  		return this.title;
  	},
  	
  	setPercentage: function(percentage) {
  		this.percentage = percentage;
  	},
  
      /** Get the completed percentage value for the transfer
       * @type Number
       */
  	getPercentage: function() {
  		return this.percentage;
  	},
  
      /** String representation of instance.
       * @type String
       */	 	
  	toString: function() {
  		var progressString = "";
  		if(this.getTitle() != null) {
  			progressString += this.getTitle();
  		}
  		if(this.getPercentage() != null) {
  			progressString += ": " + this.getPercentage() + "%";
  		}
  		return progressString;
  	}
  };

  return GarminTransferProgress;

});