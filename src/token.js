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
 *
 *
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-01 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var Token = function () {
    this.status = {
        models: []    
    };

    EventEmitter.call(this);
};

util.inherits(Token, EventEmitter);

/**
 * @description
 * Send the notifies for each observer attached at the token with the model loaded.
 * @param model {Model}
 * The model to store
 */
Token.prototype.register = function (model) {
    this.status.model = model;
    this.emit("update", this.status);
};

module.exports = Token;

