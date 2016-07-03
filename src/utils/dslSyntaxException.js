/**
 * Exception throw when there is a wrong dsl syntax
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-07-02 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLSyntaxException = function (err) {
    this.err = err;
};

DSLSyntaxException.prototype.message = function () {
    return `${this.err}`;
};

module.exports = DSLSyntaxException;

