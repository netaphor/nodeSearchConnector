# Netaphor search client

A Node client for the Netaphor Search API.

##Contents

* [Instantiation](#Instantiation)
* [search](#search)
* [update](#update)
* [optimize](#optimize)
* [deleteItem](#deleteItem)
* [commit](#commit)
* [examples](#examples)




## <a name="Instantiation"></a> Instantiation

To include in node:

>	`var neta4 = require('netaphor-search-client')`;

Creating a new connector:

>	`var searchConnector = new neta4.Connector(config)`;

###### Parameters:
 
>`config` an object with the following properties `username` (String), `password` (String), `clientId` (String)

## Methods
### <a name="search"></a> .search()
Query a hosted Solr search index 

###### Syntax:

>	`searchConnector.search(searchQuery, callback)`

###### Parameters:
> `searchQuery` the full search query as a String or an object. If using a string be sure to include a "?" at the beginning.
>
> `callback` a callback function called when the search server responds which accepts two parameters; `error` and `response`. `response` being the body of the http response from the search server.

### <a name="update"></a> .update()
Add or modify data in the Solr search index

###### Syntax:

>	`searchConnector.update(postData, callback)`

###### Parameters:
> `postData` a String in either JSON or XML format used to update or populate the search index.
>
> `callback`a function called when the search server responds which accepts two parameters; `error` and `response`. `response` being the body of the http response from the search server.

### <a name="optimize"></a> .optimize()
Used to optimize the Solr search index

>	`searchConnector.optimize(callback)`

###### Parameters:
> `callback`a function called when the search server responds which accepts two parameters; `error` and `response`. `response` being the body of the http response from the search server.


### <a name="deleteItem"></a> .deleteItem()
Delete an item from the Solr search index using its id

###### Syntax:

>	`searchConnector.update(itemId, callback)`

###### Parameters:
> `itemId` a String or Integer which is the items id
>
> `callback`a function called when the search server responds which accepts two parameters; `error` and `response`. `response` being the body of the http response from the search server.


### <a name="commit"></a> .commit()

Commit changes to the Solr search index

###### Syntax:

>	`searchConnector.commit(callback)`

###### Parameters:
> `callback`a function called when the search server responds which accepts two parameters; `error` and `response`. `response` being the body of the http response from the search server.


## <a name="examples"></a> Quick examples

	var neta4 = require('netaphor-search-client');

	// Required parameters
	var config = {
			clientId:			'yourServerName',
			username:			'should.be.an@email.com',
			password:			'yourPassword'
		};

	// Create a new search connector 
	var neta4Search = new neta4.Connector(config);

	// Load up some data
	var data = fs.readFileSync('someData.xml');

	// Send the data to the search index
	neta4Search.update(data, function (error, response) {
		if (error !== null) {
			console.log('Error with request', error);
		} else {
			// Data successfully submitted
		}	
	});	

	// Commit your search changes
	neta4Search.commit(function (error, response) {
		if (error !== null) {
			console.log('Error with request', error);
		} else {
			// Changes commited to the index and ready to query
		}
	});

	// Optimize the search index
	neta4Search.optimize(function (error, response) {
		if (error !== null) {
			console.log('Error with request', error);
		} else {
			// Index optimized
		}
	});

	// Search your index
	neta4Search.search('?q=*:*&wt=json&qt=standard&rows=10&facet=true', function (error, response) {
		if (error !== null) {
			console.log('Error with request', error);
		} else {
			// Do stuff with the results
		}
	});

	// Delete an item from the search index
	neta4Search.deleteItem(itemId, function (error, response) {
		if (error !== null) {
			console.log('Error with request', error);
		} else {
			// Item marked for deletion, commit your changes to remove the item
		}
	});
