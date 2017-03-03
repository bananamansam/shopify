const api = require('shopify-api-node');
	
exports.shopify =  {			
	getApi: function(){
		return new api({
			shopName: process.env["SHOP_NAME"],
			apiKey: process.env["API_KEY"],
			password: process.env["API_PASSWORD"]
		});
	},
	customers: {
		get: function(id){			
			var shopify = exports.shopify.getApi();
			return shopify.customer.get(id);
		},
		update: function(id, changedFields){
			var shopify = exports.shopify.getApi();
			return shopify.customer.upate(id, changedFields);
		}
	},
	products: {
		inventory: {
			get: function(productId){			
				var shopify = exports.shopify.getApi();
				return shopify.productVariant.list(productId);
			},
			update: function(variantId, oldInventory, newInventory){
				var shopify = exports.shopify.getApi();
				return shopify.productVariant.update(variantId, {
					id: variantId,
					inventory_quantity: newInventory,
					old_inventory_quantity: oldInventory
				});
			}
		}		
	}
};