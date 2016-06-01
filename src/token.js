var MaapError = require("./utils/MaapError.js");

/**
 * Set dsl's store and point to access at the any engine defined in MaaS.
 * @param engine {DSLEngine}
 * The reference at the engine so when a model will be perform, the token
 * deman the engine for to get the model to run the queries.
 *
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-01 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var Token = function (engine) {
    this.engine = engine;
    this.modelRegistry = [];
    this.observers = [];
    this.status = {
        model: []    
    };
};

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
 * Update each observer attached at the token send them the new
 * status.
 */
Token.prototype.notify = function () {
    // The my implementation of the observer pattern
    observers.forEach((update) => {
        update(this.status);
    });
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

    this.notify();
};

/**
 * @description
 * Registry the observer for send notifies when the state of the
 * token is change
 * @param observer {Function}
 * The callback to do when the notify method is invoked. The observer
 * function accept the param status, a object with the follow attributes:
 * * model {Model[]} 
 * * * The last models loaded by register method
 */
Token.prototype.subscribe = function (observer) {
    this.observers.push(observer);
};

/**
 * @description
 * Remove the registered observer if presents.
 * @observer {Function}
 * Callback that draw the observer
 */
Token.prototype.unsubscribe = function (observer) {
    var pos = this.observers.indexOf(observer);

    if (pos > -1) {
        // Remove observer from array
        this.observers.splice(pos, 1);
    }
};

module.exports = Token;

