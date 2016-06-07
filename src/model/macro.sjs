syntax row = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    let parent = ctx.next().value;
      
    let result = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    result = #`new Row({${result}}, ${parent})`;
     
    return result;
}

syntax column = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    let parent = ctx.next().value
      
    let result = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    result = #`new Column({${result}}, ${parent})`;
     
    return result;
}

syntax show = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    let parent = ctx.next().value
      
    let result = #``;
     
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    result = #`var _show = new ShowModel({${result}}, ${parent})`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`row ${bodyCtx.next().value} _show`);
        }
    }
     
    return result;
}


syntax index = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    let parent = ctx.next().value;
      
    let result = #``;
     
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    result = #`var _index = new IndexModel({${result}}, ${parent})`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('column')) {
            result = result.concat(#`column ${bodyCtx.next().value} _index`);
        }
    }
     
    return result;
}
 
syntax document = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
      
    let result = #``;
     
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    result = #`var _document = new DocumentModel({${result}}, db) register(_document)`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`row ${bodyCtx.next().value} _document`);
        }
    }
     
    return result;
}

syntax collection = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    
    let param = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        param = param.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    let result = #`var _collection = new CollectionModel({${param}}, db) registerModel(_collection)`;
     
    // Get all structure
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('index')) {
            result = result.concat(#`index ${bodyCtx.next().value} ${bodyCtx.next().value} _collection`);
        } else if (btx.isIdentifier('show')) {
            result = result.concat(#`show ${bodyCtx.next().value} ${bodyCtx.next().value} _collection`);
        }
    }
    
    return result;
}

syntax cell = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    
    let param = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        param = param.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    return #`var _cell = new CellModel({${param}}, db) registerModel(_cell)`;
}
