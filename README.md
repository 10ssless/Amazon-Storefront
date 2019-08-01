# Amazon-Storefront

This is a console-line application that emulates an online marketplace like Amazon. Utilizes ```inquirer``` and ```mysql``` modules in NodeJS.



## Customer

Shows the user the store table and gives the user the option to select item to purchase. 

```js
// find requested product by its item id in the table
SELECT 
    item_id AS "Item ID",
    product_name AS "Product",
    dept_name AS  "Department",
    price AS "Price ($)",
    stock AS "In Stock"
FROM
    products
WHERE
    item_id = ${id}
```


## Manager

Gives the manager options to ```View Products For Sale```,```View Low Inventory```,```Add To Inventory```,```Add New Product```. 


```js
// update record at requested id and add requested amount to in stock amount
UPDATE 
    products 
SET 
    stock = stock + ${add} 
WHERE 
    item_id = ${id}
```



## Supervisor

Gives the supervisor the option to ```View Product Sales By Dept```. This task calls a MySQL query that utilizes a ```LEFT JOIN``` to combine and display information from multiple tables. 

```js
// return aggregated records from total sales of each dept
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
    dept_name
```