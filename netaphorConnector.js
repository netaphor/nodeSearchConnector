'use strict';
var request = require('request'),
    qs		= require('querystring'),
    _		= require('lodash');

// Define the Connector class used for communication with a Netaphor server
var Connector =  function (config) {
    
    this.state = {
        searchServer:       'www.netaphorsearch.com',
        clientId:           '',
        username:           '',
        password:           ''
    };
    this.state = _.merge(this.state, config);
};

// The list if REST urls used for communication with the Netaphor search servers
Connector.prototype.restUrls = {
    rootPath:           "/search",
    commit:             "/update/commit",
    optimize:           "/update/optimize",
    commitAndOptimize:  "/update/commitAndOptimize",
    select:             "/select",
    update:             "/update/post",
    del:                "/update/post"
};

// Query the search index
Connector.prototype.search = function (query, callBack) {
    var q = query;

    if (query instanceof Object) {
        q = '?' + qs.unescape(qs.stringify(query));
    }

    if (q.indexOf('?') !== 0) {
        q = '?' + q;
    }

    var options = {
        callBack: callBack,
        query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.select + q
    };

    this.doRequest(options);
};

// Post data to the search index
Connector.prototype.update = function (postData, callBack) {
    var options = {
        callBack: callBack,
        query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.update,
        postData: postData
    };
    this.doRequest(options);
};

// Commit any chages made to the search index
Connector.prototype.commit = function (callBack) {
    var options = {
        callBack: callBack,
        query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.commit
    };
    this.doRequest(options);
};

// Optimize the search index
Connector.prototype.optimize = function (callBack) {
    var options = {
        callBack: callBack,
        query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.optimize
    };
    this.doRequest(options);
};

// Delete an item from the search index
Connector.prototype.deleteItem = function (itemId, callBack) {
    var options = {
        callBack: callBack,
        query: this.restUrls.rootPath + '/' + this.state.clientId + this.restUrls.del,
        postData: '<delete><id>' + itemId + '</id></delete>'
    };
    this.doRequest(options);
};

// Handle the HTTP communitcation with the search servers
Connector.prototype.doRequest = function (options) {
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

exports.Connector = Connector;