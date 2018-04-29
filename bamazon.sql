DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  dept_name VARCHAR(100) NULL,
  price DECIMAL(5,2) NULL,
  stock_quantity INT(4) NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Game of Thrones Season 7", "Bluray", 49.99, 500);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("How to Win Friends and Influence People", "Books", 9.99, 50);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Coffee Maker", "Appliances", 74.99, 25);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Galaxy S8 Active", "Cell Phones", 594.45, 75);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Creatine", "Health & Personal Care", 8.09, 422);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Sectional Sofa", "Furniture", 825.50, 12);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Dry-Erase Board", "Office Products", 12.39, 1);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Shower Curtain", "Bathroom Accessories", 10.99, 20);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("GBX Boots", "Clothing", 69.99, 10);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Nickelback: Dark Horse", "CDs & Vinyl", 7.00, 2);