# Amazon-Storefront

This is a console-line application that emulates an online marketplace like Amazon. Contains 3 different js files for a **Customer**, **Manager**, and **Supervisor** with distinct access and tasks to perform. Utilizes the ```inquirer```, ```mysql```, and ```dotenv``` modules in NodeJS.

```
WELCOME TO BAMAZON, CUSTOMER #232

┌─────────┬─────────┬────────────────────────────┬──────────────────┬───────────┬──────────┐
│ (index) │ Item ID │          Product           │    Department    │ Price ($) │ In Stock │
├─────────┼─────────┼────────────────────────────┼──────────────────┼───────────┼──────────┤
│    0    │   100   │    'Herschel Backpack'     │ 'Back To School' │    50     │    98    │
│    1    │   101   │     '13in Macbook Pro'     │  'Electronics'   │   1000    │    97    │
│    2    │   102   │     'Samsung 1TB SSD'      │  'Electronics'   │    80     │    50    │
│    3    │   103   │     'Nike Flip Flops'      │    'Apparel'     │    25     │   428    │
│    4    │   104   │  '3-Drawer Writing Desk'   │   'Furniture'    │    150    │    5     │
│    5    │   105   │   'Whey Protein Powder'    │     'Health'     │    50     │   140    │
│    6    │   106   │ 'Inflatable Swimming Pool' │     'Summer'     │    30     │    4     │
│    7    │   107   │    'Wilson Basketball'     │     'Sports'     │    20     │    60    │
└─────────┴─────────┴────────────────────────────┴──────────────────┴───────────┴──────────┘
? WHAT WOULD YOU LIKE TO DO? (Use arrow keys)
❯ MAKE A PURCHASE 
  EXIT 
```

## Customer

Shows the user the store inventory and gives the user the option to select an item and an amount to purchase. 

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