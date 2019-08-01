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
    console.log("\nWELCOME TO BAMAZON, SUPERVISOR #" + connection.threadId + "\n");
    start()
});


function start() {
    inquirer
        .prompt([{
            name: "task",
            message: "WHAT WOULD YOU LIKE TO DO?",
            type: "list",
            choices: ["VIEW PRODUCT SALES BY DEPARTMENT", "EXIT"]
        }]).then(function (data) {
            let task = data.task
            switch (task) {
                case "VIEW PRODUCT SALES BY DEPARTMENT":
                    showSales()
                    break;
                default:
                    console.log("\nTHANK YOU, GOODBYE.\n")
                    connection.end()
                    break;

            }
        })
}


function showSales() {
    connection.query(`
        SELECT
            dept_id AS "Dept ID",
            dept_name AS Department,
            MIN(departments.over_head_costs) AS "Overhead Cost",
            SUM(products.product_sales) AS "Department Sales",
            SUM(products.product_sales - departments.over_head_costs) AS "Total Profit"
        FROM
            departments
        LEFT JOIN
            products
        USING
            (dept_name)
        GROUP BY
            dept_id,
            dept_name`, 
        function (err, res) {
            if (err) throw err.stack;
            console.table(res)
            start()
        });
}