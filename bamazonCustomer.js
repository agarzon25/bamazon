var mysql = require('mysql');
var inquirer = require('inquirer')
var itemArr = [];
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

//welcome banner
console.log("#############################################################")
console.log("                   Welcome to Bamazon!!!                     ")
console.log("#############################################################")
console.log("")
console.log("    Item ID - Product - Department Name - Price - Quantity")
console.log("_____________________________________________________________")

connection.connect(function(err) {
  if (err) throw err;
  listInventory()
});

function listInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    res.forEach(item => {
    	var itemLine = `${item.item_id} - ${item.product_name} - ${item.department_name} - $${item.price} - ${item.stock_quantity}`
      itemArr.push(JSON.stringify(itemLine))
    })
    buyItem()
  });
}
  
function buyItem() {
    inquirer.prompt([
  {
    type: "list",
    name: "itemWanted",
    message: "Choose an item you would like to purchase:",
    choices: itemArr
  },
  {
  	type: 'input',
  	name: "quantity",
  	message: "How many of that item would you like to purchase?"
  }
  ]).then(guess => {
    var guessArr = guess.itemWanted.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "").split("-")
    if (!guess.quantity) {
    	console.log("You didn't enter anything. Try again!")
    }
    var makePurchase = new newPurchase(guessArr[0], guess.quantity, guessArr[3], guessArr[4]);
    makePurchase.updateSQL();
  })
};

function newPurchase(item_id, quantity, price, currQuant) {
	this.item_id = item_id;
	this.quantity = quantity;
  this.price = price;
  this.currQuant = currQuant;
}

newPurchase.prototype.updateSQL = function() {
  var total = parseFloat(this.quantity) * parseFloat(this.price);
  if (parseFloat(this.quantity) > parseFloat(this.currQuant)) {
    console.log("\nYour desired quantity exceeds our inventory. Try again!\n")
    buyItem()
    return
  }
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'answer',
      message: `You're purchase total will be $${parseFloat(total).toFixed(2)}. Would you like to finalize your purchase?`
    },
    {
      type: 'confirm',
      name: 'continue',
      message: 'Would you like to make another purchase?'
    }
    ]).then(an => {
      if(an.answer) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [this.quantity, this.item_id], function(err, res) {
          if (err) throw err;
          console.log("Your previous transaction(s) were successful!")
        })
      } else {
        console.log("First transaction was cancelled")
        connection.end()
      }

      if (an.continue) {
        buyItem()
      } else {
        console.log("Sorry you didn't find anything else you liked. Please come back again!")
        connection.end()
      }
    })

}