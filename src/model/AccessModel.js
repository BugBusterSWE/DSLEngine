var AccessModel = function (dslEngine, domain, typeDSL) {
    this.dslEngine = dslEngine;    
    this.domain = domain;
    this.typeDSL = typeDSL;
    this.engine = {
        Cell: CellEngine,
        Collection: CollectionEngine,
        Document: DocumentEngine,
        Dashboard: DashboardEngine
    };

    this.getEngine = (model) => {
        return new engine[this.typeDSL](this.dslEngine, model);
    };
}

AccessModel.prototype.by = function (token) {
    var model = this.domain.getByToken(token);

    if (model === undefined) {
        throw new Error("No such dsl reference with the token passed by argument");
    
    } else if (model.constructor.name !== this.typeDSL) {
        throw new Error(`Wrong cast from ${this.typeDSL} to ${model.constructor.name}`);      
    
    } else {
        return this.getEngine(model);    
    }
};

AccessModel.prototype.all = function () {
    var registry = this.domain.getAll();

    var remains = registry.filter((value) => {
        return (value.constructor.name === this.typeDSL);
    });

    return this.getEngine(remains);
};

module.exports = AccessModel;

