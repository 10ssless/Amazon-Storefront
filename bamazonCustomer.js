var inquirer = require("inquirer")
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.LOCAL_SERVER_PSWD,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err.stack;
    console.log("\nWELCOME TO BAMAZON, CUSTOMER #" + connection.threadId + "\n");
    showAll()
});


function start() {
    inquirer
        .prompt([
            {
                name: "task",
                message: "WHAT WOULD YOU LIKE TO DO?",
                type: "list",
                choices: ["MAKE A PURCHASE", "EXIT"]
            }
        ]).then(function (data) {
            let task = data.task
            switch (task) {
                case "MAKE A PURCHASE":
                    buyItem()
                    break;
                default:
                    console.log("\nTHANK YOU, GOODBYE.\n")
                    connection.end()
                    break;

            }
        })
}


function showAll() {
    connection.query(
        `SELECT 
            item_id AS "Item ID",
            product_name AS "Product",
            dept_name AS  "Department",
            price AS "Price ($)",
            stock AS "In Stock" 
        FROM 
            products`, 
        function (err, res) {
            if (err) throw err.stack;
            console.table(res)
            start()
        });
}



function buyItem(id,q) {
    inquirer
        .prompt([{
                name: "itemID",
                message: "ENTER THE ID OF THE ITEM OF THE PRODUCT YOU'D LIKE TO PURCHASE:",
                type: "number"
            },
            {
                name: "quantity",
                message: "HOW MANY UNITS WOULD YOU LIKE:",
                type: "number"
            }
        ]).then(function (data) {
            let id = data.itemID
            let q = data.quantity
            connection.query(`SELECT item_id,product_name,dept_name,price,stock FROM products WHERE item_id = ${id}`, function (err, res) {
                if (err) throw err.stack;
                
                if(res[0].stock >= q){
                    let total = q*res[0].price
                    let left = res[0].stock - q
                    console.log(`\nYou have purchased ${q} ${res[0].product_name}(s).\nYou're total is $${total}`)
        
                    updateDB(id,left,total)
                }
                else if(res[0].stock == 0) {
                    console.log(`\nSorry, that item is out of stock. Try selecting a different item.\n`)
                    start()
                }
                else if (res[0].stock < q) {
                    console.log(`\nThere's not enough ${res[0].product_name}'s in the store. Try entering a different amount.\n`)
                    start()
                }
                // connection.end()
            });
        })


}



function updateDB(id,q,total) {
    connection.query(
        `UPDATE 
            products 
        SET 
            stock = ${q}, product_sales = ${total} 
        WHERE 
            item_id = ${id}`, 
        function (err, res) {
            if (err) throw err.stack;
            console.log("\nInventory updated.\n")
            showAll()
        });
}

