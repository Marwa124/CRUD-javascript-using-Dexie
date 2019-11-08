import initDatabase, {
    dataInsert,
    getData,
    createElement
} from './module.js'; 

var db = initDatabase('javascript-db', {
    products: '++id,name,seller,price'
});

// input tags
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

// buttons
const btnCreate = document.getElementById('btn-create');
const btnRead = document.getElementById('btn-read');
const btnUpdate = document.getElementById('btn-update');
const btnDelete = document.getElementById('btn-delete');

const notfound = document.getElementById('notfound');

// Insert data with create button
btnCreate.onclick = (event) => {
    let inputsValue = dataInsert(db.products, {
        name: productName.value,
        seller: seller.value,
        price: price.value
    });
    productName.value = seller.value = price.value = '';

    // Access get data function
    getData(db.products, (dataItem) => {
            productId.value = dataItem.id + 1 || 'Id';
    });
    
    dataTable();

    // Alert messages
    let insertmsg = document.querySelector('.insertmsg');
    getMsg(inputsValue, insertmsg);
    
}

// Displaying Data with btnRead button
btnRead.addEventListener('click', dataTable)

function dataTable() {
    const tbody = document.getElementById('tbody');

    // Remove duplicate element rows from the table
    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }

    /* Access the dynamic elements function using:
        getData function to display the object.
    */
    getData(db.products, data => {
        if(data){
            createElement('tr', tbody, tr => {
                for(let value in data){
                    createElement('td', tr, td => {
                        td.textContent = (data.price === data[value]) ? '$' + data[value] : data[value];
                    })
                }
                createElement('td', tr, td => {
                    createElement('i', td, i => {
                        i.className = 'fas fa-edit btnEdit';
                        i.onclick = editIcon;
                        i.setAttribute(`data-id`, data.id);
                    })
                })
                createElement('td', tr, td => {
                    createElement('i', td, i => {
                        i.className = 'fas fa-trash-alt btnDelete';
                        i.onclick = deleteIcon;
                        i.setAttribute('data-id', data.id);
                    })
                })
            })
        }else {
            notfound.textContent = "No record found in the database...!";
        }
    })
}

function editIcon(event) {
    let targetItem = event.target.dataset.id;
    
    // Convert (targetItem) from string type into number type
    let idNumber =  parseInt(targetItem);
    db.products.get(idNumber, data => {
        productId.value = data.id || 0;
        productName.value = data.name || '';
        seller.value = data.seller || '';
        price.value = data.price || '';
    })
}

// Delete icon
function deleteIcon(event) {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    dataTable();
}

// Update button 
btnUpdate.onclick = () => {
    const id = parseInt(productId.value);
    if(id != parseInt(0)){
        db.products.update(id, {
            name: productName.value,
            seller: seller.value,
            price: price.value
        }).then((updated) => {
            // message display
            let msg = updated ? true : false;
            let updatemsg = document.querySelector('.updatemsg');
            getMsg(msg, updatemsg);
        })
        productName.value = seller.value = price.value = '';
    }
}

// Delete All button 
btnDelete.onclick = () => {
    db.delete();
    db;
    db.open();
    dataTable();

    productId.value = 'Id';
    let deletemsg = document.querySelector('.deletemsg');
    getMsg(true, deletemsg);
}

function getMsg(event, element) {
    if(event){
        element.className += ' slideDown';
        setTimeout( () => {
            element.classList.forEach(classElement => {
                classElement == 'slideDown' ? element.classList.remove('slideDown') : '';
                console.log(classElement);
            }); 
        }, 4000);
    }
}
