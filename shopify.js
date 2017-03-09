const api = require('shopify-api-node');
var that = {
	_api: null,
	_getAll: function (apiFunction, params, items) {
		params = params || {};
		params.page = params.page || 1;
		params.limit = params.limit || 50;
		items = items || {
			count: 0,
			data: []
		};
				
		return apiFunction(params).then(data => {
			items.data = items.data.concat(data);
			items.count = items.count + data.length;
			if (data.length < params.limit) {
				return items;
			}
			else {
				params.page = params.page + 1;
				return that._getAll(apiFunction, params, items);
			}
		}).catch(err => console.log(err));
	}
};
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
			return that._api.customer.upate(id, changedFields);
		}
	},
	products: {
		create: function (product) {
			return that._api.product.create(product);
		},
		count: function () {
			return that._api.product.count();
		},
		list: function (params) {
			return that._api.product.list(params);
		},
		getAll: function (params) {
			return that._getAll((p) => { return that._api.product.list(p); }, params);
		},
		get: function (id) {
			return that._api.product.get(id);
		},
		variants: {
			get: function (productId, params) {
				return that._api.productVariant.get(productId, params);
			},
			update: function (variantId, newValues) {
				return that._api.productVariant.update(variantId, newValues);
			}
		}
	}
};

that._api = exports.shopify.getApi();