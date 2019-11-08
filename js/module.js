// Create Database
const initDatabase = (db, table)=>{
    var db = new Dexie("db");
        db.version(1).stores(table);
        db.open();
    return db;
}

// insert Data
const dataInsert = (table, items) => {
    const validate = validation(items);
    const validPrice = validPrices(items.price);
    if(validate && validPrice){
        table.bulkAdd([items]);
        console.log("data has been registered successfully");
    }else {
        console.log('You have to insert a value');
    }
    return  validate && validPrice;
}

// Input Validations
const validation = request => {
    let valid = false;
    for(let item in request){
        if(request[item] != '' && request.hasOwnProperty(item)){
            valid = true;
        }else { valid = false;}
    }
    return valid;
}

// Validate the price input
const validPrices = price => {
    let hasPrice = false;
    if(price == Number(price)){
        hasPrice = true;
    }else { hasPrice = false; }
    return hasPrice;
}

// Get data from database
// fn is a higher order function ( function inside a function )
const getData = (dbTable, fn) => {
    let targetItem = {};
    let index = 0;

    dbTable.count(count => {
        if(count){
            dbTable.each(items => {
                targetItem = sortData(items);
                fn(targetItem, index++);
            })
        }else { fn(0); }
    });
}

// Sort data objects
const sortData = dataObject => {
    let object = 0;
    object = {
        id: dataObject.id,
        name: dataObject.name,
        seller: dataObject.seller,
        price: dataObject.price
    }
    return object;
}

// Create a dynamic elements
const createElement = (tagname, appendTo, fn) => {
    const tagElement = document.createElement(tagname);
    appendTo.appendChild(tagElement);
    fn(tagElement);
}

export default initDatabase; 
export {dataInsert, getData, createElement}