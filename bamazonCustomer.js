// require mysql npm package
var mysql = require('mysql');
// require inquirer to prompt user
var inquirer = require('inquirer')
// intiate a connection to mysql server
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  listInventory()
});

function listInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //console.log(res);
    console.log("#############################################################")
	console.log("                 Check out our inventory                     ")
	console.log("#############################################################")
	console.log("Item ID - Product - Department Name - Price - Quantity")
	console.log("_____________________________________________________________")
    res.forEach(item => {
    	console.log(`${item.item_id} - ${item.product_name} - ${item.department_name} - ${item.price} - ${item.stock_quantity}`)
    })
    connection.end();
  });
}

function buyItem() {
	inquirer.prompt([
	{
		name:'letter',
		message: 'Guess a letter!'
	}
	]).then(guess => {
		this.checkGuess(guess)
	})
}
