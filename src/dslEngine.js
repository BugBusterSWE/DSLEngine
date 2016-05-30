var mongoose = require("mongoose");
var DslDomain = require("./model/DslDomain.js");
var AccessModel = require("./model/AccessModel.js");
var MaapError = require("./utils/MaapError.js");

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed 
 * in text format.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Update document and correct import | 2016-05-12 |
 * | Andrea Mantovani | Create class | 2016-05-11 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLEngine = function () {
    this.domain = new DslDomain();
	this.db = undefined;
};

/**
 * @description
 * Connect to the dabase to perform the action defined in the dsl througt the
 * his URL.
 * @param database {string}
 * URL for the collection into the database to perform the action. The url is
 * in the form:
 * `<dbuser>:<dbpassword>@<address>:<port>/<database>/<collection>`
 * @return {Promise}
 * The promise of the connection to the db and initial process. The promise
 * is resolve with nothing if no errors is occurred, otherwise with the
 * errors. If an istance of DSLEngine was create, the promise is always 
 * resolve.
 */
DSLEngine.prototype.connectTo = function (database) {
    var self = this;

    return new Promise((resolve, reject) => {
		if (self.connection === undefined) {
			var connection = mongoose.createConnection(
				`mongodb://${database}`
			);

			connection.on("error", function(err) {
				reject(err);
			});

			connection.on("open", function(ref) {
				// Error to read the macro
				try {
					// Use the connection to perform the DSL
					self.db = connection;
				} catch (err) {
					reject(err);
				}
		
				resolve(ref);
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
    if (this.db === undefined) {
		this.db = connection;
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
    return new Promise((resolve, reject) => {
		this.domain.loadDSL(dsl, (err, ids) => {
			if (err) {
				reject(err);
			} else {
				resolve(ids);
			}
		});
    });
};

/** 
 * @description
 * Get the access point to take the engine specified in the argument.
 * @param typeDSL {Engine}
 * Type of engine that you want the access
 * @return {AccessPoint}
 * The access point to the Engine specified.
 */
DSLEngine.prototype.get = function (typeDSL) {
	return new AccessModel(this.db, this.domain, typeDSL);
}

module.exports = DSLEngine;

