/**
 * Exception throw when the id don't retrieve a model.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-07-02 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var ModelNotFoundException = function (ref, type) {
    this.ref = ref;
    this.type = type;
};

ModelNotFoundException.prototype.message = function () {
    return `The model ${this.type} referenced by ${this.ref} can not ` +
    `be found`;
};

module.exports = ModelNotFoundException;

