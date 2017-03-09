const api = require('shopify-api-node');
var that = { _api: null };
exports.shopify = {
	getApi: function () {
		return new api({
			shopName: process.env["SHOP_NAME"],
			apiKey: process.env["API_KEY"],
			password: process.env["API_PASSWORD"],
			autoLimit: { calls: process.env["API_LIMIT_PER_SEC"], interval: 1000 },
		});
	},
	customers: {
		create: function (customer) {
			return that._api.customer.create(customer);
		},
		search: function (query) {
			return that._api.customer.search(query);
		},
		get: function (id) {
			return that._api.customer.get(id);
		},
		update: function (id, changedFields) {
			return exports.shopify.customer.upate(id, changedFields);
		}
	},
	products: {
		create: function (product) {
			return that._api.product.create(product);
		},
		count: function () {
			return that._api.product.count();
		},
		list: function () {
			return that._api.product.list();
		},
		get: function (id) {
			return that._api.product.get(id);
		},
		variants: {
			get: function (productId, params) {
				return that._api.productVariant.get(productId, params);
			},
			update: function (variantId, newValues) {
				console.log(newValues);
				return that._api.productVariant.update(variantId, newValues);
			}
		}
	}
};

that._api = exports.shopify.getApi();