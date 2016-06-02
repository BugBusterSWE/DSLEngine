var MaapError = require("./utils/MaapError.js");
const EventEmitter = require('events');
const util = require('util');

/**
 * Set dsl's store and point to access at the any engine defined in MaaS.
 * Token inherits from EventEmitter. Any engine create own events to
 * comunicate with the other engines. The only once own event of Token is
 * "update". The event "update" is emit when the new model to be register
 * into the token.
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
    this.modelRegistry = [];
    this.status = {
        model: []    
    };

    EventEmitter.call(this);
};

util.inherits(Token, EventEmitter);

/**
 * @description
 * Extract the models stored in the token.
 * @return {Model[]}
 */
Token.prototype.extract = function () {
    return this.modelRegistry;
};

/**
 * @description
 * Save into this token the model extracted from the dsl file and
 * send the notifies for each observer attached at the token.
 * @param model {Model}
 * The model to store
 */
Token.prototype.register = function (model) {
    this.modelRegistry.push(model);

    this.status.model = model;
    this.emit("update");
};

module.exports = Token;

