var MaapError = require("./utils/MaapError");
const EventEmitter = require("events");
const util = require("util");

/**
 * Event emitter, it allow at the engine to listen any logic event bounded    
 * with the DSLEngine. For each event, it get methods to be register for 
 * a event (name convetion is: on{Event}) and methods to be
 * emit event (name convention is: emit{Event}).
 * Furthemore is possibile add personal event used the method 'on', inherit 
 * from EventEmitter.
 *
 * @author Andrea Mantovani
 * @license MIT
 */
var TransmissionNode = function () {
    EventEmitter.call(this);
}

util.inherits(TransmissionNode, EventEmitter);

/**
 * @description
 * Emit the event load and call all listener attached of this.
 * @param {Model[]}
 * The models loaded to send at the any listeners registered to the "load"
 * event.
 */
TransmissionNode.prototype.emitLoad = function (models) {
    this.emit("load", models);
};

/**
 * @description
 * Alert the client that the model is receved.
 */
TransmissionNode.prototype.emitReply = function (payload) {
    this.emit("reply", payload);  
};

TransmissionNode.prototype.finish = function (listener) {
    return this.removeListener("reply", listener);
};

TransmissionNode.prototype.onReply = function (listener) {
    return this.on("reply", listener);
};

/**
 * @description
 * Register listern for the event "load". This event is emitted when
 * the DSLEngine has been finish to load the dsl model by the macro.
 * @param listener {Function}
 * The listener for event "load". The listener should have a param for
 * catch the models passed by TransmissionNode. 
 * @return {TransmissionNode} 
 * Returns a reference to the TransmissionNode so calls can be chained.
 */
TransmissionNode.prototype.onLoad = function (listener) {
    return this.on("load", listener);
};

module.exports = TransmissionNode;
