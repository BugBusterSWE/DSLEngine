var mongoose = require("mongoose");
var DslConcreteStrategy = require("./model/DslConcreteStrategy");
var MaapError = require("./utils/MaapError");
var Token = require("./token");
var NoConnectionEstabilished = require("./utils/noConnecionEstabilished");

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed 
 * in text format.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Uso Token and remove method get | 2016-06-01 |
 * | Andrea Mantovani | Update document and correct import | 2016-05-12 |
 * | Andrea Mantovani | Create class | 2016-05-11 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLEngine = function () {
    this.strategy = new DslConcreteStrategy();
	this.db = undefined;
};

/**
 * @description
 * Create a ready token to comunicate with the engine. The DSLEngine to must connect
 * with a db to create the token, otherwise the NoConnectionEstabilished exception is 
 * throw.
 * @return {Token}
 * A token connected with this engine.
 */
DSLEngine.prototype.createToken = function () {
	if (this.db === undefined) {
		throw new NoConnectionEstabilished();	
	}

	var token = new Token();

	return token;
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
 * Load the dsl into the token passed by argument. Use this method if you want load new dsl 
 * model in a previous token.
 * @param dsl {string}
 * The code of the dsl
 * @param token {Token} 
 * The token where to be store the dsl. 
 * @return {Token}
 * The token with the models loaded within his. If no token is passed, the DSLEngine 
 * will create a new token with the model loaded.
 * @throws {MaaPError}
 */
DSLEngine.prototype.loadDSL = function (dsl, token) {
	token = token || this.createToken();
    token.registry(this.strategy.load(dsl));

	return token;
};

module.exports = DSLEngine;

