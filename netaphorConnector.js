var request = require('request'),
	_ = require('lodash');

// Define the NetaphorConnector class used for communication with a Netaphor server
var NetaphorConnector =  function (config) {
	'use strict';
	this.state = {
		searchServer:		'www.netaphorsearch.com',
		clientId:			'',
		username:			'',
		password:			''
	};
	this.state = _.merge(this.state, config);
};

// The list if REST urls used for communication with the Netaphor search servers
NetaphorConnector.prototype.restUrls = {
	rootPath:			"/search",
	commit:				"/update/commit",
	optimize:			"/update/optimize",
	commitAndOptimize:	"/update/commitAndOptimize",
	select:				"/select",
	update:				"/update/post",
	del:				"/update/post"
};

// Query the search index
NetaphorConnector.prototype.search = function (queryString, callBack) {
	'use strict';
	var options = {
		callBack: callBack,
		query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.select + queryString
	};
	this.doRequest(options);
};

// Post data to the search index
NetaphorConnector.prototype.update = function (postData, callBack) {
	'use strict';
	var options = {
		callBack: callBack,
		query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.update,
		postData: postData
	};
	this.doRequest(options);
};

// Commit any chages made to the search index
NetaphorConnector.prototype.commit = function (callBack) {
	'use strict';
	var options = {
		callBack: callBack,
		query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.commit
	};
	this.doRequest(options);
};

// Optimize the search index
NetaphorConnector.prototype.optimize = function (callBack) {
	'use strict';
	var options = {
		callBack: callBack,
		query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize
	};
	this.doRequest(options);
};

// Delete an item from the search index
NetaphorConnector.prototype.deleteItem = function (itemId, callBack) {
	'use strict';
	var options = {
		callBack: callBack,
		query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize
	};
	this.doRequest(options);
};

// Handle the HTTP communitcation with the search servers
NetaphorConnector.prototype.doRequest = function (options) {
	'use strict';
	var requestConfig = {};

	// If we are updating the search index switch to POST
	if (options.postData !== 'undefined') {
		requestConfig.method = 'POST';
		requestConfig.body = options.postData;
	}

	requestConfig.auth = {
		user: this.state.username,
		pass: this.state.password,
		sendImmediately: false
	};

	requestConfig.url = 'https://' + this.state.searchServer + options.query;

	request(requestConfig, function (error, res, body) {
		if (!error && res.statusCode === 200) {
			options.callBack(null, body);
		} else {
			if (!error) {
				error = {
					msg: 'Non 200 response',
					statusCode: res.statusCode
				};
			}
			options.callBack(error, body);
		}
	});
};

exports.NetaphorConnector = NetaphorConnector;