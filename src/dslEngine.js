var mongoose = require("mongoose");
var domain = require("./model/DslDomain.js");

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed in text format.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-05-11 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLEngine = function () {
    this.domain = undefined;
}

/**
 * @description
 * Connect to the dabase to perform the action defined in the dsl througt the
 * his URL.
 * @param database {string}
 * URL for the collection into the database to perform the action. The url is
 * in the form:
 * `<dbuser>:<dbpassword>@<address>:<port>/<database>/<collection>`
 * @return {Promise}
 * The promise of the connection to the db. The promise is resolve with nothing
 * if no errors is occurred, otherwise, with the errors. If an istance of 
 * DSLEngine was create, the promise is always resolve.
 */
DSLEngine.prototype.connectTo = function (database) {
    return new Promise((resolve, reject) => {
	if (this.domain === undefined ) {
	    var connection = mongoose.createConnection(`mongodb://${database}`);

	    connection.on("error", function(err) {
		reject(err);
	    });

	    connection.on("open", function(ref) {
		// Use the connection to perform the DSL
		this.domain = new DslDomain(connection);
		resolve();
	    });
	 } else { 
	     resolve();
	 }
    });
};

/**
 * @description
 * Connect to the dabase to perform the action defined in the dsl through a
 * defined connection.
 * @param database {mongoose.Connection}
 * Connection for the collection into the database to perform the action
 * @throws {MaaPError}
 */
DSLEngine.prototype.connectWith = function (connection) {
    if (this.domain === undefined) {
	this.domain = new DslDomain(connection);
    }
};

/**
 * @description
 * Load the dsl into the engine to codifing it.
 * @param dsl {string}
 * The code of the dsl
 * @throws {MaaPError[]}
 */
DSLEngine.prototype.loadDSL = function (dsl) {
    this.domain.loadDSL(dsl);
    
    // Errors catched throughout the codification
    var errors = this.domain.getErrors();
    if (errors !== undefined) {
	throw errors;
    }
};

module.exports = DSLEngine;