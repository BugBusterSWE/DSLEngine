/**
 * Exception throw when there is unexpected value inside the dsl
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-13 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var UnexpectedParamException = function (model, param) {
    this.model = model;
    this.param = param;
};

UnexpectedParamException.prototype.message = function () {
    return `Unexpected param ${this.param} in ${this.model.toString()}`;
};

module.exports = UnexpectedParamException;

