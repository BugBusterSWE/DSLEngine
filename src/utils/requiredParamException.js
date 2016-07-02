/**
 * Exception throw when there isn't required param inside the dsl
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-13 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var RequiredParamException = function (model, param) {
    this.model = model;
    this.param = param;
};

RequiredParamException.prototype.message = function () {
    return `Required param ${this.param} in ${this.model.toString()}`;
};

module.exports = RequiredParamException;

