syntax row = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
      
    let result = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    result = #`var _row = new Row(_show, {${result}}) _show.addRow(_row)`;
     
    return result;
}

syntax rowDoc = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
      
    let result = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    result = #`var _row = new Row(_document, {${result}}) _document.addRow(_row)`;
     
    return result;
}

syntax column = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
      
    let result = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        result = result.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    result = #`var _column = new Column(_index, {${result}}) _index.addColumn(_column)`;
     
    return result;
}

syntax show = function (ctx) {
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
     
    result = #`_show = new ShowModel({${result}}, _collection) _collection.setShowModel(_show)`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`row ${bodyCtx.next().value}`);
        }
    }
     
    return result;
}


syntax index = function (ctx) {
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
     
    result = #`_index = new IndexModel(_collection, {${result}}) _collection.setIndexModel(_index)`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('column')) {
            result = result.concat(#`column ${bodyCtx.next().value}`);
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
     
    result = #`_document = new ShowModel({${result}}) register(_document)`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`rowDoc ${bodyCtx.next().value}`);
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
     
    let result = #`_collection = new CollectionModel({${param}}) registerModel(_collection)`;
     
    // Get all structure
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('index')) {
            result = result.concat(#`index ${bodyCtx.next().value} ${bodyCtx.next().value}`);
             
        } else if (btx.isIdentifier('show')) {
            result = result.concat(#`show ${bodyCtx.next().value} ${bodyCtx.next().value}`);
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
    
    let result = #`_cell = new Cell({${param}}) registerModel(_cell)`;
    
    let value = #``;
    
    for (let btx of bodyCtx) {
       if (btx.isIdentifier()) {
            bodyCtx.next();
            value = value.concat(#`${btx}: ${bodyCtx.next().value}`);
            bodyCtx.next();
       }
    }
    
    return result.concat(#`_cell.set({${value}})`);
}

var _collection;
var _document;
var _index;
var _show;
var _cell;


