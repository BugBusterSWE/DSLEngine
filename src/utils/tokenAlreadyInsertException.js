/**
 * Exception throw when try push a token but one other is alredy insert.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-13 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var TokenAlreadyInsertException = function () {};

// TODO
TokenAlreadyInsertException.prototype.message = function () {
    return "";
};

module.exports = TokenAlreadyInsertException;

