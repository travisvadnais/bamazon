var mysql = require('mysql');
var fs = require('fs');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');
var Supervisor = require("./bamazonSup.js");

var connection =mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"8706213Ab",
    database: "bamazon_Db"
})

connection.connect(function(err){
    if(err) throw (err);
    start();
})

var start = function() {
    inquirer.prompt({
        name: "access_type",
        type: "list",
        message: "Hi! Please select your position\n",
        choices: [
            "Customer",
            "Supervisor",
            "Exit"
        ]
    })
    .then(function(answer) {
        switch (answer.access_type) {
            case "Customer":
                customerStart();
                break;
            case "Supervisor":
                Supervisor();
                break;
            case "Exit":
                process.exit(0);
                break;
        }
    })
}

var customerStart = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices:[
            "See Available Items",
            "Purchase an Item",
            "Nothing, thanks.  Please let me out of here!"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "See Available Items":
                exports.getData();
                break;
            case "Purchase an Item":
                purchaseItem();
                break;
            case "Nothing, thanks.  Please let me out of here!":
                process.exit(0);
                break;
        }
    })
}

exports.getData = function() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err
        var table = new Table({
            head: ['Product Number', 'Item', 'Department', 'Price', 'Quantity in Stock']
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].dept_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(colors.blue("\n-----------------------------------------------------------------------------------------------------------------"));
        console.log(colors.blue("\n    Current Product Listings: \n"));
        console.log(table.toString()+"\n");
        start();
    })
}

var purchaseItem = function() {
    inquirer.prompt([{
        name: "product_to_buy",
        type: "input",
        message: "Which product number would you like to buy?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    },{
        name: "order",
        type: "input",
        message: "How many units would you like to buy?",
        validate: function(value) {
            //This will auto-validate the input to make sure it's a number
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer){
        //I want to return the quantity in stock of the item whose ID matches the customer's answer
        var query = "SELECT stock_quantity FROM products WHERE ?"
        connection.query(query, {item_id: answer.product_to_buy}, function(err,res){
            //If there aren't enough in stock, let them know and go back to the purchase item menu
            if (res[0].stock_quantity < answer.order){
                console.log(colors.blue("\n------------------------------------------------------------------------\n"));
                console.log(colors.blue("There are only ") + colors.red.underline(res[0].stock_quantity) + colors.blue(" left in stock.  Please reduce your order and try again"));
                console.log(colors.blue("\n------------------------------------------------------------------------\n"));
                //Recursively call fx to have user lower the order total
                purchaseItem();
            }
            //If there are enough, we need to update the products table by setting the stock quantity equal to the current total minus the customer's order, but only update the item the customer is ordering.  W/o the WHERE keyword, ALL items would get updated.  Need that filter in there.
            else {
                var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
                connection.query(updateQuery, [res[0].stock_quantity - answer.order, answer.product_to_buy], function(err, res) {
                    if (err) throw err;
                })
                //Have to calculate the cost, so run one more query where we grab the price of the customer's product
                var cost = "SELECT price FROM products WHERE item_id = ?"
                connection.query(cost, [answer.product_to_buy], function(err, res) {
                    var totalCost = res[0].price * answer.order;
                    if (totalCost > 0) {
                        console.log(colors.blue("\n------------------------------------------------------------------------\n"));
                        console.log(colors.blue("Thanks for your Purchase!  Your Bamazon card was charged: ") + colors.green("$" + totalCost.toFixed(2)) + "\n");
                        console.log(colors.blue("------------------------------------------------------------------------\n"));
                        customerStart();
                    }
                    else {
                        totalCost = totalCost * (-1);
                        console.log(colors.blue("\n------------------------------------------------------------------------\n"));
                        console.log(colors.blue("Your return was successful!  Your Bamazon card was refunded: ") + colors.green("$" + totalCost.toFixed(2)) + "\n");
                        console.log(colors.blue("------------------------------------------------------------------------\n"));
                        customerStart();
                    }
                })
            }
            
        })
    })
}

var exports = module.exports;