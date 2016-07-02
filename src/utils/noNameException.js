/**
 * Exception throw when in a model the attribute name is not be setted
 * @param model {Model} The model where the name attribute is missed
 *
 * @author Andrea Mantovani
 * @license MIT
 */
var NoNameException = function (model) {
    this.model = model;
};

NoNameException.prototype.message = function () {
    return `In the model ${this.model.toString()} the attribute 'name' is ` +
	`not be setted`;
};

module.exports = NoNameException;
