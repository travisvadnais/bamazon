# bamazon
Amazon-esque CLI app to practice SQL knowledge

## Overview

This app is designed to demonstrate basic SQL functionality and how it interacts w/ Javascript to make updates to a database.

## Functionality Used

General | Node Dependencies
------- | -------------
SQL | inquirer
Javascript | colors
Node.js | cli-table

## Features

1. **Customer** - Allows you to interact w/ the app from the perspective of a customer
    * **See Available Items** - Allows you to view a list of all items available for purchase on Bamazon;
    * **Purchase an Item** - Allows you to purchase from the current inventory of items
1. **Supervisor** - Allows you to interact w/ the app from the perspective of a supervisor
    * **View All Products for Sale** - Same as *See Available Items* for customers;
    * **Check Low Inventory Items** - Will display all items w/ an inventory count of < 5;
    * **Add Stock** - Allows the supervisor to add stock to any item;
    * **Add a New Item to Inventory** - Allows the supervisor to add an entirely new line item to be available for purchase

## How to Use

1. Install dependencies;
1. Run **node bamazaonCustomer.js**
1. Select the mode:
    * **Customer** - Available in v1;
    * **Supervisor** - Available in v1;
    * **Manager** - Coming in a later version

## Task List

- [x] ~~Version 1~~
- [ ] Build Manager View
- [ ] Add additional form validation

## Link to Demo

https://drive.google.com/file/d/1aorhihWoJfCiQR040XdpBds6dq199xsy/view
