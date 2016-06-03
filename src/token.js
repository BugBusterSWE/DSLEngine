var MaapError = require("./utils/MaapError");
const EventEmitter = require("events");
const util = require("util");

/**
 * Set dsl's store and point to access at the any engine defined in MaaS.
 * Token inherits from EventEmitter. Any engine create own events to
 * comunicate with the other engines. The only once own event of Token is
 * "update". The event "update" is emit when the new model to be register
 * into the token. The event send the follow object : 
 * ```
 * {
 *   models: Model[]
 * }
 * ```
 * `status.models` is the array with the last models loaded.
 * Furthemore a connection to MongoDB refer to the token, the engine
 * should manages more connections.
 *
 * @param db {mongoose.Connection}
 * Connection to the db
 *
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Insert reference to db | 2016-06-01 |
 * | Andrea Mantovani | Method getRegistry | 2016-06-01 |
 * | Andrea Mantovani | Create class | 2016-06-01 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var Token = function (db) {
    this.registry = [];
    this.db = db;

    this.status = {
        models: []    
    };

    this.waitAck = function (count) {
	var self = this;
	var errors = [];

	var receive = () => {
	    count--;

	    if (count === 0) {
		if (errors.length > 0) {
		    self.emit("errorLoad", errors);
		} else {
		    self.emit("successLoad");
		}
	    };
	};

	// Register listener for the two ack type:
	// ok -> model loaded correctly
	// error -> an error is occured
	// When error is emit, the error is insert into the errors array
	// to send it as resone of the promise reject
	this.on("ok", receive);
	this.on("error", (err) => {
	    errors.push(err);
	    receive();
	});
    };

    EventEmitter.call(this); 
};

util.inherits(Token, EventEmitter);

/**
 * @description
 * Get the connection keep from the token.
 * @return {mongoose.Connection}
 * The connection.
 */
Token.prototype.getConnection = function () {
    return this.db;
};

/**
 * @description
 * Get the model registry archived by Token.
 * @return {Model[]}
 * Array of the archive models.
 */
Token.prototype.getRegistry = function () {
    return registry;
};

/**
 * @description
 * Send the notifies for each observer attached at the token with the model loaded.
 * @param model {Model}
 * The model to store
 */
Token.prototype.register = function (model) {
    this.status.model = model;
    this.waitAck(model.length);

    this.emit("update", this.status);
};

module.exports = Token;

