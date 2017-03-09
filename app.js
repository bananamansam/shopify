
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
    log: function (data, indent) {
        fs.appendFileSync("TestData/output.json", JSON.stringify(data, null, indent || 2));
    },
    getProductCount: function () {
        api.shopify.products.count().then((data) => console.log(data)).catch((errors) => console.log(errors));
    },
    getAllProducts: function (params) {
        api.shopify.products.getAll(params).then((data) => test.log(data)).catch((errors) => console.log(errors));
    },
    listProduct: function (page, limit) {
        api.shopify.products.list({
            page: page,
            limit: limit
        }).then((data) => console.log(data.length)).catch((errors) => console.log(errors));
    },
    getAllVariants: function () {
        api.shopify.products.list().then((data) => data.forEach(d => console.log(d.variants))).catch((errors) => console.log(errors));
    },
    getProduct: function (id) {
        api.shopify.products.get(id).then((data) => test.log(data)).catch((errors) => console.log(errors));
    },
    getInventory: function (variantId, filter) {
        api.shopify.products.variants.get(variantId, filter).then((data) => console.log(data)).catch((errors) => console.log(errors));
    },
    getMatchingVariants: function (inventoryMap) {
        api.shopify.products.getAll()
            .then(products => {
                var promises = [];
                // process updates                    
                products.data.forEach(p => {
                    if (p.variants) {
                        p.variants.forEach(v => {
                            // check if the variant is in our map and if the quantity has changed                                                            
                            if (inventoryMap[v.sku]) {
                                if (v.inventory_quantity !== inventoryMap[v.sku].Quantity) {
                                    test.log({
                                        item: v,
                                        action: 'update'
                                    });
                                }

                                inventoryMap[v.sku] = null;
                            }
                        });
                    }
                });

                // process inserts                    
                for (key in inventoryMap) {
                    var val = inventoryMap[key];
                    if (val) {
                        test.log({
                            item: val,
                            action: 'insert'
                        });
                    }
                }

                return Promise.all(promises);
            });
    },
    updateShopifyInventory: function () {
        var map,
            records = parse(fs.readFileSync('testdata/zINV-01.csv', 'utf8'), {
                columns: true,
                delimiter: ',',
            });

        map = handler.inventoryProcessing.getInventoryMap(records);
        handler.inventoryProcessing.updateShopify(map)
            .then(data => test.log(data))
            .catch(err => console.log('error: ' + err));
    }
};

// test.getProduct(10471788431);
// test.getInventory(10471788431);
// test.getProduct(10471788431);
// test.getProductCount();
// test.getAllProducts({limit: 100});
// test.listProduct(4, 50);
// test.updateShopifyInventory();