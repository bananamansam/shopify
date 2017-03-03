

var handler = require('./index');
var api = require('./shopify');
var fs = require('fs');
// var fileBody = fs.readFileSync('subs.csv', 'utf8');
// handler.processCsvBody(fileBody);
//api.shopify.customers.get(5073646799, (data) => console.log(data), (errors) => console.log(errors));

api.shopify.products.inventory.get(9512457988).then(inv => {
	console.log(inv);
	api.shopify.products.inventory.update(inv.id, inv.old_inventory_quantity, inv.old_inventory_quantity + 10)
	.then(res => console.log(res))
	.catch(err => console.log(err));
}).catch(err => console.log(err));

