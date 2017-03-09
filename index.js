process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const parse = require('csv-parse/lib/sync');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const api = require('./shopify');

var that = {
    raiseError: function (err) {
        console.log(err);
    },
    inventoryProcessing: {
        getInventoryMap: function (records) {
            var inventory = {};
            records.forEach(r => {
                var sku = r["Item Number"];
                inventory[sku] = r;
            });

            return inventory;
        },
        createProduct: function (record) {
            return api.shopify.products.create({
                title: record["Description"],
                vendor: 'Nexia Home',
                variants: [{
                    inventory_management: "shopify",
                    sku: record["Item Number"],
                    inventory_quantity: record["Quantity"]
                }]
            });
        },
        updateShopify: function (inventoryMap) {
            return api.shopify.products.getAll()
                .then(products => {
                    var promises = [];
                    // process updates                    
                    products.data.forEach(p => {
                        if (p.variants) {
                            p.variants.forEach(v => {
                                // check if the variant is in our map and if the quantity has changed                                
                                if (inventoryMap[v.sku]) {
                                    if (v.inventory_quantity != inventoryMap[v.sku].Quantity) {
                                        promises.push(api.shopify.products.variants.update(v.id, {
                                            inventory_management: "shopify",
                                            inventory_quantity: inventoryMap[v.sku].Quantity,
                                            old_inventory_quantity: v.inventory_quantity
                                        })
                                            .then(data => {
                                                data.action = 'updated';
                                                return data;
                                            })
                                            .catch(err => that.raiseError({
                                                item: p,
                                                action: 'update'
                                            })));
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
                            promises.push(that.inventoryProcessing.createProduct(val)
                                .then(data => {
                                    data.action = 'inserted';
                                    return data;
                                })
                                .catch(err => that.raiseError({
                                    item: val,
                                    action: 'insert'
                                })));
                        }
                    }

                    return Promise.all(promises).then(processedRecords => {
                        return {
                            count: processedRecords.length,
                            data: processedRecords
                        }
                    });
                });
        }
    },
    getCustomer: function (obj) {
        return {
            first_name: obj.FIRST_NAME,
            last_name: obj.LAST_NAME,
            email: obj.EMAIL,
            accepts_marketing: obj["OPTED OUT"] === "F",
            verified_email: false,
            tax_exempt: false,
            addresses: [{
                address1: '',
                address2: '',
                city: obj.HOUSE_CITY,
                province: '',
                zip: obj.HOUSE_ZIP_CODE,
                phone: '',
                province_code: obj.HOUSE_STATE,
                country_code: 'US',
                country_name: 'United States',
                default: true
            }]
        };
    },
    processInventory: function (records) {
        records.forEach(function (record) {
        });
    },
    processCustomers: function (records) {
        records.forEach(function (record) {
            api.shopify.customers.create(that.getCustomer(record))
                .then(result => console.log(result))
                .catch(err => console.log(err));
        });

    },
    processCsv: function (csvBody, forceUpperCase) {
        var formattedBody = forceUpperCase ? csvBody.toUpperCase() : csvBody,
            records = parse(formattedBody, {
                columns: true,
                delimiter: ',',
            });

        if (process.env['IS_INVENTORY'] === "T")
            that.processInventory(records);
        else
            that.processCustomers(records);
    }
};

exports.handler = (event, context, callback) => {
    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            //console.log('CONTENT TYPE:', data.ContentType);
            console.log('Filename:', key);
            //console.log('SAMPLETEST:', process.env.SAMPLETEST);
            //console.log('Body:', data.Body.toString());
            that.processCsv(data.Body.toString());

            callback(null, data.ContentType);
        }
    });
};

exports.inventoryProcessing = that.inventoryProcessing;
