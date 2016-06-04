var mongoose = require("mongoose");
var DslConcreteStrategy = require("./model/DslConcreteStrategy");
var MaapError = require("./utils/MaapError");
var Token = require("./token");
var TransmissionNode = require("./transmissionNode");
var NoConnectionEstabilished = require("./utils/noConnecionEstabilished");

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed 
 * in text format.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | The token keep the connectio to db | 2016-06-03 |
 * | Andrea Mantovani | Uso Token and remove method get | 2016-06-01 |
 * | Andrea Mantovani | Update document and correct import | 2016-05-12 |
 * | Andrea Mantovani | Create class | 2016-05-11 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLEngine = function () {
    this.strategy = new DslConcreteStrategy();
    this.node = new TransmissionNode();
};

/**
 * @description
 * Create a ready token to comunicate with the engine. The DSLEngine to must connect
 * with a db to create the token, otherwise the NoConnectionEstabilished exception is 
 * throw.
 * @return {Token}
 * A token connected with this engine.
 */
DSLEngine.prototype.generateToken = function (db) {
    return new Token(db);
};

/**
 * @description
 * Load the dsl into the token passed by argument. Use this method if you want load new dsl 
 * model in a previous token.
 * @param dsl {string}
 * The code of the dsl
 * @param token {Token} 
 * The token where to be store the dsl. 
 * @return {Promise<void>}
 * @throws {MaaPError}
 */
DSLEngine.prototype.loadDSL = function (dsl, token) {
    return new Promise((resolve, reject) => {
        try {
            var models = this.strategy.load(dsl, token.getConnection());
        } catch (err) {
            // Catch the loading error
            reject(err);
        }

        var number = model.length;
        var errors = [];
        
        var request = (err) => {
            number--;

            if (err) {
                errors.push(err);
            }
            
            if (number === 0) {
                this.node.emitComplete();
                
                if (errors.lenght > 0) {
                    reject(errors);
                } else {
                    resolve();
                }                
            }
        };
        
        this.node
            .onAck(request)
            .onComplete(request);
            .emitLoad(models);
    });
};

module.exports = DSLEngine;
