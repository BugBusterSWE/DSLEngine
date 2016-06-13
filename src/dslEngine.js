var mongoose = require("mongoose");
var DslConcreteStrategy = require("./model/DslConcreteStrategy");
var MaapError = require("./utils/MaapError");
var Token = require("./token");
var TransmissionNode = require("./transmissionNode");
var LoadModelsProtocol = require("./protocol/loadModelsProtocol")
var NoConnectionEstabilished = require("./utils/noConnectionEstabilished");
var NoTokenConnectedException = require("./utils/noTokenConnectedException");
var CellEngine = require("./engine/CellEngine");
var CollectionEngine = require("./engine/CollectionEngine");
var DashboardEngine = require("./engine/DashboardEngine");
var DocumentEngine = require("./engine/DocumentEngine");

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
    
    this.cellEngine = new CellEngine(this.node);
    this.collectionEngine = new CollectionEngine(this.node);
    this.dashboardEngine = new DashboardEngine(this.node);
    this.documentEngine = new DocumentEngine(this.node);
    
    this.token = undefined;
};

DSLEngine.prototype.cell = function () {
    if (this.token == undefined) {
        throw new NoTokenConnectedException();
    }
    
    return this.cellEngine;
};

DSLEngine.prototype.collection = function () {
    if (this.token == undefined) {
        throw new NoTokenConnectedException();
    }
    
    return this.collectionEngine;
};

DSLEngine.prototype.dashboardEngine = function () {
    if (this.token == undefined) {
        throw new NoTokenConnectedException();
    }
    
    return this.dashboardEngine;
};

DSLEngine.prototype.documentEngine = function () {
    if (this.token == undefined) {
        throw new NoTokenConnectedException();
    }
    
    return this.documentEngine;
};

/**
 * @description 
 * Remove the token from engine emit an event to save the engines' environment,
 * so when the token is repush, the engines can take the data stored into it.
 * @return {Token}
 * The token push into the engine.
 */
DSLEngine.prototype.ejectSafelyToken = function () {
    var token = this.token;
    this.token = undefined;
    
    this.node.emitEjectToken(token);
    return token;
};

/**
 * @description
 * Create a token to comunicate with the engine. The token is not directly 
 * connect to the engine, and is needed call `pushToken` method to make.
 * @return {Token}
 * A token connected with this database passed by argument.
 */
DSLEngine.prototype.generateToken = function (db) {
    return new Token(db);
};

/**
 * @description
 * Load the dsl into the token passed by argument. Use this method if you want 
 * load new dsl model in a previous token.
 * @param dsl {string}
 * The code of the dsl
 * @param token {Token} 
 * The token where to be store the dsl. 
 * @return {Promise<void>}
 * @throws {NoTokenConnectedException}
 */
DSLEngine.prototype.loadDSL = function (dsl) {
    if (this.token == undefined) {
        throw new NoTokenConnectedException();
    }
    
    return new Promise((resolve, reject) => {
        try {
            var models = this.strategy.load(dsl, this.token.getConnection());
        } catch (err) {
            // Catch the loading error
            reject(err);
        }

        protocolLoad = new LoadModelsProtocol(this.node);
        protocolLoad
            .waitAck(models.length)
            .onComplete((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        
        this.node.emitLoad(models);
    });
};

/**
 * @description
 * Connect the token with the engine to perform action of save, load model and
 * environment.
 * @param token {Token}
 * Token to store the envirnoment.
 */
DSLEngine.prototype.pushToken = function (token) {
    if (this.token != undefined) {
	throw new TokenAlreadyInsertException();
    }
    
    this.token = token;
    this.node.emitPushToken(token);
};

module.exports = DSLEngine;

