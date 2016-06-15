/**
 * Exception throw when in a model the attribute label is not be setted
 * @param name {string} The name of model where the label attributed is missed
 *
 * @author Andrea Mantovani
 * @license MIT
 */
var NoLabelException = function (name) {
    this.name = name;
};

NoLabelException.prototype.message = function () {
    return `In the model ${this.name} the attribute 'label' is not be setted`
};

module.exports = NoLabelException;
