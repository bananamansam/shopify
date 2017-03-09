
var env = require('./_donotcheckin/environment');
var handler = require('./index');
var api = require('./shopify');
var fs = require('fs');
var parse = require('csv-parse/lib/sync');

//console.log(process.env);

// var fileBody = fs.readFileSync('testdata/subs.csv', 'utf8');
// handler.processCsv(fileBody);
//api.shopify.customers.get(5530085967, (data) => console.log(data), (errors) => console.log(errors));
//api.shopify.customers.search({query: 'email:alyson.ries@irco.com', fields: "email, id"}).then(customers => { console.log(customers); });
//api.shopify.customers.search({query: 'email:alyson.ries@irco.com'}).then(customers => { console.log(customers[0].addresses[0]); });
// api.shopify.products.variants.get(9512457988).then(inventories => {
// 	console.log(inventories);
// 	inventories.forEach(inv => {
// 		api.shopify.products.variants.update(inv.id, inv.old_inventory_quantity, inv.old_inventory_quantity + 10)
// 		.then(res => console.log(res))
// 		.catch(err => console.log(err));
// 	});	
// }).catch(err => console.log(err));

//get customer by email from shopify
//api.shopify.customers.search({ query: 'email:alyson.ries@irco.com', fields: "email, id" }).then(customers => { console.log(customers); });

//get and loop through products
//api.shopify.products.variants.get(9512457988).then(inventories => {
// 	console.log(inventories);
// 	inventories.forEach(inv => {
// 		api.shopify.products.variants.update(inv.id, inv.old_inventory_quantity, inv.old_inventory_quantity + 10)
// 		.then(res => console.log(res))
// 		.catch(err => console.log(err));
// 	});	
// }).catch(err => console.log(err));


var test = {
    getProductCount: function () {
        api.shopify.products.count().then((data) => console.log(data)).catch((errors) => console.log(errors));
    },
    getAllProducts: function() {
        api.shopify.products.list().then((data) => console.log(data)).catch((errors) => console.log(errors));    
    },
    getAllVariants: function() {
        api.shopify.products.list().then((data) => data.forEach(d => console.log(d.variants))).catch((errors) => console.log(errors));    
    },
    getProduct: function () {
        api.shopify.products.get(9512457988).then((data) => console.log(data)).catch((errors) => console.log(errors));
    },
    getInventory: function () {
        api.shopify.products.variants.get(38240220175, { title: "Default Title" }).then((data) => console.log(data)).catch((errors) => console.log(errors));
    },
    updateShopifyInventory: function () {
        var records = parse(fs.readFileSync('testdata/zINV-01.csv', 'utf8'), {
            columns: true,
            delimiter: ',',
        }),
            map = handler.inventoryProcessing.getInventoryMap(records);

        handler.inventoryProcessing.updateShopify(map)
            .catch(err => console.log(err));
    }
};

test.getProduct();