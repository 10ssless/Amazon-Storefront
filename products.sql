DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  dept_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock INT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	dept_id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(100) NULL,
    over_head_costs DECIMAL(10,2) NULL,
    PRIMARY KEY (dept_id)
);

ALTER TABLE products AUTO_INCREMENT=100;
ALTER TABLE departments AUTO_INCREMENT=300;

INSERT INTO products(product_name,dept_name,price,stock)
VALUES 
("Herschel Backpack","Back To School",50.00,100),
("13in Macbook Pro","Electronics",1000.00,100),
("Samsung 1TB SSD","Electronics",80.00,60),
("Nike Flip Flops","Apparel",25.00,500),
("3-Drawer Writing Desk","Furniture",150.00,5),
("Whey Protein Powder","Health",50.00,200),
("Inflatable Swimming Pool","Summer",30.00,10);

INSERT INTO departments(dept_name,over_head_costs)
VALUES ("Electronics",10000.00),
("Back To School",300.00),
("Apparel",1000.00),
("Furniture",5000.00),
("Health",500.00),
("Summer",100.00);


SELECT * FROM products;


-- SELECT 
-- 	dept_id,
-- 	dept_name, 
--     SUM(departments.over_head_costs), 
--     SUM(products.product_sales) AS dept_sales,
--     SUM(products.product_sales-departments.over_head_costs) AS total_profit 
-- FROM 
-- 	departments
-- LEFT JOIN 
-- 	products
-- USING
-- 	(dept_name)
-- GROUP BY
-- 	dept_id,
-- 	dept_name;



SELECT
	dept_id AS 'Dept ID',
	dept_name AS 'Department',
	MIN(departments.over_head_costs) AS 'Overhead Cost',
	SUM(products.product_sales) AS 'Department Sales',
	SUM(products.product_sales - departments.over_head_costs) AS 'Total Profit'
FROM
	departments
LEFT JOIN
	products
USING
	(dept_name)
GROUP BY
	dept_id,
	dept_name;
    
    
    
