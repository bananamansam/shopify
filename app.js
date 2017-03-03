
var env = require('./_donotcheckin/environment');
var handler = require('./index');
var api = require('./shopify');
var fs = require('fs');

console.log(process.env);

// var fileBody = fs.readFileSync('testdata/subs.csv', 'utf8');
// handler.processCsv(fileBody);
//api.shopify.customers.get(5073646799, (data) => console.log(data), (errors) => console.log(errors));
// api.shopify.customers.search({query: 'email:alyson.ries@irco.com', fields: "email, id"}).then(customers => { console.log(customers); });
//api.shopify.customers.search({query: 'email:alyson.ries@irco.com'}).then(customers => { console.log(customers[0].addresses[0]); });
// api.shopify.products.inventory.get(9512457988).then(inventories => {
// 	console.log(inventories);
// 	inventories.forEach(inv => {
// 		api.shopify.products.inventory.update(inv.id, inv.old_inventory_quantity, inv.old_inventory_quantity + 10)
// 		.then(res => console.log(res))
// 		.catch(err => console.log(err));
// 	});	
// }).catch(err => console.log(err));

