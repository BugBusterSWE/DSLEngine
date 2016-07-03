/**
 * Exception throw when the engine try to perform an action that is required 
 * the token.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-13 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var NoTokenConnectedException = function () {};

// TODO
NoTokenConnectedException.prototype.message = function () {
    return "";
};

module.exports = NoTokenConnectedException;
