/**
 * Exception throw when there is wrong type
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-06-13 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var WrongTypeException = function (model) {
    this.model = model;
};

WrongTypeException.prototype.message = function () {
    return `Parameter with a wrong type in ${model.toString()}`;
};

module.exports = WrongTypeException;

