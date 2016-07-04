/**
 * Exception throw when the id don't retrieve a collection.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Create class | 2016-07-02 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var CollectionNotFoundException = function (id) {
    this.id = id;
};

CollectionNotFoundException.prototype.message = function () {
    return `The collection was referenced by id ${this.id} can not be found`;
};

module.exports = CollectionNotFoundException;

