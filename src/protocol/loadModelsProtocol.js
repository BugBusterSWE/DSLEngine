var LoadModelsProtocol = function (node) {
    this.node = node;
    this.number = 0;
    this.errors = [];
    
    this.complete = () => {
        this.node.finish(this.protocol);
    };
    
    this.protocol = (payload) => {
        payload = payload || {};
        
        this.number--;
        
        if (payload.err) {
            this.errors.push(payload.err);
        }
        
        if (number === 0) {
            this.complete();
        }
    };
}

LoadModelsProtocol.prototype.waitAck = function (number) {
    this.number = number;
    this.node.onReply(this.protocol);
    
    return this;
};

LoadModelsProtocol.prototype.onComplete = function (callback) {
    this.complete = () => {
        this.node.finish(this.protocol);
        
        callback(this.errors);
    };
};

module.exports = LoadModelsProtocol;
