const api = require('shopify-api-node');
var that = {_api: null};	
exports.shopify =  {
	getApi: function(){
		return new api({
			shopName: process.env["SHOP_NAME"],
			apiKey: process.env["API_KEY"],
			password: process.env["API_PASSWORD"]
		});
	},
	customers: {
		create: function(customer){
			console.log(customer);
			return that._api.customer.create(customer);
		},
		search: function(query){
			return that._api.customer.search(query);
		},
		get: function(id){						
			return that._api.customer.get(id);
		},
		update: function(id, changedFields){			
			return exports.shopify.customer.upate(id, changedFields);
		}
	},
	products: {
		inventory: {
			get: function(productId){							
				return that.productVariant.list(productId);
			},
			update: function(variantId, oldInventory, newInventory){								
				var updated = {
					id: variantId,
					inventory_quantity: newInventory,
					old_inventory_quantity: oldInventory
				};
				return that.productVariant.update(variantId, updated);
			}
		}		
	}
};

that._api = exports.shopify.getApi();