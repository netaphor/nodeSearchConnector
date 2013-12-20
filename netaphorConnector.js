var request = require('request'),
	_ = require('lodash');

// Define the NetaphorConnector class used for communication with a Netaphor server
var NetaphorConnector =  function (config) {
	'use strict';
	this.state = {
		searchServer:		'www.netaphorsearch.com',
		backupServer:		'b1.netaphorsearch.com',
		clientId:			'',
		username:			'',
		password:			'',
		firstRequestFailed: false
	};

	_.merge(config, this.state);
};

// The list if REST urls used for communitcation with the Netaphor search servers
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
	var options = {};
	options.callBack = callBack;
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.select + queryString;
	this.doRequest(options);
};

// Post data to the search index
NetaphorConnector.prototype.update = function (postData, callBack) {
	'use strict';
	var options = {};
	options.callBack = callBack;
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.update;
	options.postData = postData;
	this.doRequest(options);
};

// Commit any chages made to the search index
NetaphorConnector.prototype.commit = function (callBack) {
	'use strict';
	var options = {};
	options.callBack = callBack;
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.commit;
	this.doRequest(options);
};

// Optimize the search index
NetaphorConnector.prototype.optimize = function (callBack) {
	'use strict';
	var options = {};
	options.callBack = callBack;
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize;
	this.doRequest(options);
};

// Delete an item from the search index
NetaphorConnector.prototype.deleteItem = function (itemId, callBack) {
	'use strict';
	var options = {};
	options.callBack = callBack;
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize;
	this.doRequest(options);
};

// Handle the HTTP communitcation with the search servers
NetaphorConnector.prototype.doRequest = function (options) {
	'use strict';
	var requestConfig = {};

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

	request(requestConfig, function (error, response, body) {
		console.log(response.statusCode, body);
		if (!error && response.statusCode === 200) {
			options.callBack(null, body);
		} else {
			options.callBack(error, body);
		}
	});
};


exports.NetaphorConnector = NetaphorConnector;