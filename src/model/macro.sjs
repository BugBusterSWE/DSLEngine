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
 
syntax cellInstance = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    
    let param = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        param = param.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
    
    return #`new CellModel({${param}})`;
}

syntax collectionInstance = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    let parent = ctx.next().value;
    
    let param = #``;
    
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        param = param.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    let result = #`new CollectionModel({${param}}, db)`;
     
    // Get all structure
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('index')) {
            result = result.concat(#`index ${bodyCtx.next().value} ${bodyCtx.next().value} ${parent}`);
        } else if (btx.isIdentifier('show')) {
            result = result.concat(#`show ${bodyCtx.next().value} ${bodyCtx.next().value} ${parent}`);
        }
    }
    
    return result;
}

syntax documentInstance = function (ctx) {
    // The content of the parens in a collection
    let paramCtx = ctx.next().value.inner();
    // The content of the braces in a collection
    let bodyCtx = ctx.next().value.inner();
    let parent = ctx.next().value;

    let param = #``;
     
    // Get all params
    for (let ptx of paramCtx) {
        // Eat ':'
        paramCtx.next();
        param = param.concat(#`${ptx}: ${paramCtx.next('expr').value}`);
        // Eat ','
        paramCtx.next();
    }
     
    let result = #`new DocumentModel({${param}}, db)`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`row ${bodyCtx.next().value} ${parent}`);
        }
    }
     
    return result;
} 
 
syntax document = function (ctx) {
    let delimiterHeadCtx = ctx.next().value;
    let delimiterBodyCtx = ctx.next().value;
    
    let result = #`var _document = documentInstance ${delimiterHeadCtx} ${delimiterBodyCtx} _document;`; 
    return result.concat(#`registerModel(_document);`);
}

syntax collection = function (ctx) {
    let delimiterHeadCtx = ctx.next().value;
    let delimiterBodyCtx = ctx.next().value;
    
    let result = #`var _collection = collectionInstance ${delimiterHeadCtx} ${delimiterBodyCtx} _collection;`;
    return result.concat(#`registerModel(_collection);`);
}

syntax cell = function (ctx) {
    // The content of the parens in a collection
    let delimiterParamCtx = ctx.next().value;
    return #`var _cell = cellInstance ${delimiterParamCtx} registerModel(_cell)`;
}

syntax dashrow = function (ctx) {
    let referenceCtx = ctx.next().value.inner();
    let parent = ctx.next().value;
    
    let result = #`var _dashrow = new DashRowModel();`;
    
    for (let rtx of referenceCtx) {
        if (rtx.isIdentifier("cell")) {
            let delimiter = referenceCtx.next().value;
            let first = delimiter.inner().next().value;
            
            if (first.isStringLiteral()) {
                result = result.concat(#`_dashrow.registerCell(${first});`);
            } else {
                result = result.concat(#`var _cell = cellInstance ${delimiter};`);
                result = result.concat(#`_dashrow.registerCell(_cell.getLabel()) registerModel(_cell); `);
            }   
        } else if (rtx.isIdentifier("collection")) {
            let delimiterHead = referenceCtx.next().value;
            let first = delimiterHead.inner().next().value;
            
            if (first.isStringLiteral()) {
                result = result.concat(#`_dashrow.registerCollection(${first});`);
            } else {
                let delimiterBody = referenceCtx.next().value;
            
                result = result.concat(
                    #`var _collection = collectionInstance ${delimiterHead} ${delimiterBody} _collection;`
                );
                result = result.concat(
                    #`_dashrow.registerCollection(_collection.getLabel()) registerModel(_collection);`
                );
            }   
        } else if (rtx.isIdentifier("document")) {
            
            let delimiterHead = referenceCtx.next().value;
            let first = delimiterHead.inner().next().value;
            
            if (first.isStringLiteral()) {
                result = result.concat(#`_dashrow.registerDocument(${first});`);
            } else {
                let delimiterBody = referenceCtx.next().value;
                
                result = result.concat(
                    #`var _document = documentInstance ${delimiterHead} ${delimiterBody} _document;`
                );
                result = result.concat(
                    #`_dashrow.registerDocument(_document.getLabel()) registerModel(_document); `
                );
            }   
        }
    }
    
    return #`${result} _dashrow.swap(${parent});`;
}

syntax dashboard = function (ctx) {
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
     
    let result = #`var _dashboard = new DashboardModel({${param}})`;
     
    // Get all structures
    for (let btx of bodyCtx) {
        if (btx.isIdentifier('row')) {
            result = result.concat(#`dashrow ${bodyCtx.next().value} _dashboard`);
        }
    }
     
    return result;
} 