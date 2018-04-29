var mysql = require('mysql');
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

connection.connect(function(err){
    if(err) throw (err);
    buyProduct();
})

var buyProduct = function() {
    console.log("Connection Works");
}