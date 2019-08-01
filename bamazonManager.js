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
    console.log("\nWELCOME TO BAMAZON, MANAGER #" + connection.threadId + "\n");
    start()
});


function start() {
    inquirer
        .prompt([
            {
                name: "task",
                message: "WHAT WOULD YOU LIKE TO DO?",
                type: "list",
                choices: ["VIEW PRODUCTS FOR SALE","VIEW LOW INVENTORY","ADD TO INVENTORY","ADD NEW PRODUCT","EXIT"]
            }
        ]).then(function (data) {
            let task = data.task
            switch(task){
                case "VIEW PRODUCTS FOR SALE":
                    showAll()
                    break;
                case "VIEW LOW INVENTORY":
                    lowStock()
                    break;
                case "ADD TO INVENTORY":
                    addInv()
                    break;
                case "ADD NEW PRODUCT":
                    addProd()
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
            product_name AS Product,
            dept_name AS  Department,
            price AS "Price ($)",
            stock AS "In Stock" ,
            product_sales AS "Product Sales ($)"
        FROM 
            products`,
        function (err, res) {
            if (err) throw err.stack;
            console.table(res)
            start()
        });
}



function lowStock() {
    connection.query(
        `SELECT 
            item_id AS "Item ID",
            product_name AS Product,
            dept_name AS Department,
            price AS "Price ($)",
            stock AS "In Stock",
            product_sales AS "Product Sales ($)"
        FROM
            products 
        WHERE 
            stock < 5`, 
        function (err, res) {
            if (err) throw err.stack;
            console.table(res)
            start()
        });
}



function addInv() {
    inquirer
        .prompt([{
                name: "itemID",
                message: "ENTER THE ID OF THE ITEM YOU'D LIKE TO UPDATE INVENTORY:",
                type: "number"
            },
            {
                name: "quantity",
                message: "HOW MANY UNITS WOULD YOU LIKE TO ADD:",
                type: "number"
            }
        ]).then(function (data) {
            let id = data.itemID
            let add = data.quantity
            connection.query(
                `UPDATE 
                    products 
                SET 
                    stock = stock + ${add} 
                WHERE 
                    item_id = ${id}`, 
                function (err, res) {
                    if (err) throw err.stack;
                    console.log("\nDatabase updated.\n")
                    start()
                });
            })

}

function addProd() {
    inquirer
        .prompt([{
                name: "product",
                message: "WHAT IS THE NAME OF THE PRODUCT YOU'D LIKE TO ADD?",
                type: "input"
            },
            {
                name: "dept",
                message: "WHAT DEPARTMENT IS THE PRODUCT IN?",
                type: "input"
            },
            {
                name: "price",
                message: "WHAT IS THE UNIT PRICE OF THE PRODUCT?",
                type: "number"
            },
            {
                name: "stock",
                message: "HOW MANY UNITS OF THE PRODUCT WOULD YOU LIKE TO ADD?",
                type: "number"
            }
        ]).then(function (data) {
            let prod = data.product
            let dept = data.dept
            let price = data.price
            let stock = data.stock
            connection.query(
                `INSERT INTO 
                    products(product_name,dept_name,price,stock) 
                VALUES 
                    ("${prod}","${dept}",${price},${stock}) `, 
                function (err, res) {
                    if (err) throw err.stack;
                    console.log("\nInventory updated.\n")
                    showAll()
                });
            })

}


