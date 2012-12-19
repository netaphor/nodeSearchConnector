/* global console: true */
var https = require('https'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;


// Define the NetaphorConnector class used for communication with a Netaphor server
var NetaphorConnector =  function (config) {
	'use strict';
	var key;
	for (key in config) {
		this.state[key] = config[key];
	}
};

// Inherit form the Events module so that we can emit custom events
util.inherits(NetaphorConnector, EventEmitter);

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

// State required for this class to work
NetaphorConnector.prototype.state = {
	searchServer:		'',
	backupServer:		'b1.netaphorsearch.com',
	clientId:			'',
	username:			'',
	password:			'',
	firstRequestFailed: false
};

// Query the search index
NetaphorConnector.prototype.search = function (queryString) {
	'use strict';
	var options = {};
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.select + queryString;
	options.eventName = 'searchComplete';
	this.doRequest(options);
};

// Post data to the search index
NetaphorConnector.prototype.update = function (postData) {
	'use strict';
	var options = {};
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.update;
	options.postData = postData;
	options.eventName = 'updateComplete';
	this.doRequest(options);
};

// Commit any chages made to the search index
NetaphorConnector.prototype.commit = function () {
	'use strict';
	var options = {};
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.commit;
	options.eventName = 'commitComplete';
	this.doRequest(options);
};

// Optimize the search index
NetaphorConnector.prototype.optimize = function () {
	'use strict';
	var options = {};
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize;
	options.eventName = 'optimizeComplete';
	this.doRequest(options);
};


// Delete an item from the search index
NetaphorConnector.prototype.deleteItem = function (itemId) {
	'use strict';
	var options = {};
	options.query = this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize;
	options.eventName = 'deleteComplete';
	this.doRequest(options);
};

// Handle the HTTP communitcation with the search servers
NetaphorConnector.prototype.doRequest = function (options) { //query, callBack, postData
	'use strict';
	var reqOptions = {},
		responseText = '',
		request,
		self = this;

	reqOptions.hostname		= this.state.searchServer;
	reqOptions.path			= options.query;
	reqOptions.method		= 'GET';
	reqOptions.headers		= {
							'Authorization': 'Basic ' + new Buffer(this.state.username + ':' + this.state.password).toString('base64')
						};

	console.log(reqOptions);

	if (typeof options.postData !== 'undefined') {
		reqOptions.method = 'POST';
	}

	request = https.request(reqOptions);

	request.on('response', function (response) {
		response.on('data', function (data) {
			responseText += data;
		});

		response.on('end', function () {
			self.emit(options.eventName, responseText);
		});
	});

	request.on('error', function (error) {
		self.emit('error', responseText);
	});

	if (typeof options.postData !== 'undefined') {
		request.write(options.postData);
	}

	request.end();
};


exports.NetaphorConnector = NetaphorConnector;
/*

	public function search($query, $requestHandler, $extras = "") {
		$requestString = $this -> getQueryUri("select") . "?q=" . urlencode($query) . "&qt=" . $requestHandler . $extras;
		$this -> query = $requestString;
		$this -> handleResponse($this -> sendRequest($requestString));
	}

	public function update($data) {
		$requestString = $this -> getQueryUri("update");
		$this -> handleResponse($this -> sendRequest($requestString, $data));
	}

	public function commit() {
		$requestString = $this -> getQueryUri("commit");
		$this -> handleResponse($this -> sendRequest($requestString));
	}

	public function optimize() {
		$requestString = $this -> getQueryUri("optimize");
		$this -> handleResponse($this -> sendRequest($requestString));
	}

	public function commitAndOptimize() {
		$requestString = $this -> getQueryUri("commitAndOptimize");
		$this -> handleResponse($this -> sendRequest($requestString));
	}

	public function deleteItem($item) {
		$requestString = $this -> getQueryUri("delete");
		$postData = "<delete><id>" . $item . "</id></delete>";
		$this -> handleResponse($this -> sendRequest($requestString, $postData));
	}

*/