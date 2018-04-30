var bamazonCustomer = require("./bamazonCustomer.js");
var mysql = require('mysql');
var fs = require('fs');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');

var connection =mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"8706213Ab",
    database: "bamazon_Db"
})

function Supervisor() {
    inquirer.prompt ({
        name: "sup_menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Products for Sale",
            "Check Low Inventory Items",
            "Add Stock",
            "Add a New Item to Inventory",
            "I'm All Set"
        ]
    }) .then(function(answer) {
        switch (answer.sup_menu) {
            case "View All Products for Sale":
                bamazonCustomer.getData();
                break;
            case "Check Low Inventory Items":
                viewLowInventory();
                break;
            case "Add Stock":
                addStockToInventory();
                break;
            case "Add a New Item to Inventory":
                addnewItemToInventory();
                break;
            case "I'm All Set":
                process.exit(0);
                break;
        }
    })
}

var viewLowInventory = function() {
    //This one is pretty much straight English: Select everything from the table where there is less than 5 of that item in stock
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function(err, res){
        var table = new Table({
            head: ['Product Number', 'Item', 'Department', 'Price', 'Quantity in Stock']
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, colors.red(res[i].stock_quantity)]
            )
        }
        console.log(colors.blue("\n----------------------------------------------------------------------------------------"));
        console.log(colors.blue("\n              Here is a list of all items w/ fewer than " + colors.red.underline("5") + " units in stock:\n"));
        console.log(table.toString()+"\n");
        Supervisor();
    })
};

var addStockToInventory = function() {
    inquirer.prompt([{
        name: "add_stock",
        type: "input",
        message: "To which product would you like to add stock?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    },{
        name: "howMuch",
        type: "input",
        message: "How many do you want to add?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer){
        //We need to grab the stock quantity data from the matching product, but I'm grabbing everything to populate the confirmation table at the end
        var query = "SELECT * FROM products WHERE ?"
        connection.query(query, {item_id: answer.add_stock}, function(err,res){
            //SET the stock quantity to the current total + the answer total
            var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
                connection.query(updateQuery, [res[0].stock_quantity + parseInt(answer.howMuch), answer.add_stock], function(err, res) {
                    if (err) throw err;
                })
            //Set up a new table
            var table = new Table({
                head: ['Product Number', 'Item', 'Department', 'Price', 'New Quantity']
            });
            //Populate the table with JUST the updated item and highlight the new quantity in green
            table.push(
                [res[0].item_id, res[0].product_name, res[0].dept_name, res[0].price, colors.green(res[0].stock_quantity + parseInt(answer.howMuch))]
            )
            console.log(colors.blue("\n-------------------------------------------------------------------------------\n"));
            console.log(colors.blue("    Your stock was successfully updated!\n"));       
            console.log(table.toString()+"\n");
            Supervisor();
        })
    })
}

var addnewItemToInventory = function() {
    inquirer.prompt([{
        name: "add_item",
        type: "input",
        message: "What's the Name of the Item to Add?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's NOT a number
            if(isNaN(value) == false){
                return false;
            } else {
                return true;
            }
        }
    },{
        name: "dept",
        type: "input",
        message: "In Which Department Does the Item Belong?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's NOT a number
            if(isNaN(value) == false){
                return false;
            } else {
                return true;
            }
        }
    },{
        name: "price",
        type: "input",
        message: "What is the Item's Price?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    },{
        name: "quantity",
        type: "input",
        message: "How Many Will be Added to Stock?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer){
        //Add the item to the 'products' table
        var query = "INSERT INTO products (product_name, dept_name, price, stock_quantity) "
        query += "VALUES(?, ?, ?, ?)"
        //Feed the values
        connection.query(query, [answer.add_item, answer.dept, answer.price, answer.quantity], function(err,res){
            if (err) throw err;
            //Now pull another query to populate the confirmation table
            var queryForTable = "SELECT * FROM products WHERE ?"
            //The value is asking to find a product name that matches the one we just added
            connection.query(queryForTable, {product_name: answer.add_item}, function(err,res){
                //Set up the confirmation table headers
                var table = new Table({
                    head: ['Product Number', 'Item', 'Department', 'Price', 'Quantity']
                });
                //Populate the table with JUST the added item and highlight the new item# in green
                table.push(
                    [colors.green(res[0].item_id), res[0].product_name, res[0].dept_name, res[0].price, res[0].stock_quantity]
                )
                console.log(colors.blue("\n------------------------------------------------------------------------\n"));
                console.log(colors.blue("    " + answer.add_item + " was successfully added!\n"));
                console.log(table.toString()+"\n");
                Supervisor();
            })
        })
    })
} //End addItemToInventory fx










//Export the Letter object
module.exports = Supervisor;