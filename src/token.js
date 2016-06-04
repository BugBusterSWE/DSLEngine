var MaapError = require("./utils/MaapError");

/**
 * The memory of the engine. With the token to be create 
 *
 * @param db {mongoose.Connection}
 * Connection to the db
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var Token = function (db) {
    this.store = {};
    this.db = db;
};

Token.prototype.load = function (name) {
    return this.store[name];
};

Token.prototype.save = function (name, payload) {
    this.store[name] = payload;   
};

module.exports = Token;

