# node-digest-auth-client
A client request for HTTP digest authentication

[![Build Status](https://travis-ci.org/bill0119/node-digest-auth-client.svg?branch=master)](https://travis-ci.org/bill0119/node-digest-auth-client)


# install
```
npm install node-digest-auth-client
```

# usage
```
let digest = require('node-digest-auth-client');
const postData = "CurrentUTCDateTime=2019-09-04T00:54:50.565Z\r\n";
const options = {
	hostname: '127.0.0.1',
	port: 80,
	path: '/api/test.cgi',
	method: 'POST',
	headers: {
		'Connection': 'Keep-Alive',
		'Content-Type': 'text/plain',
		'Content-Length': postData.length,
		'Host': '127.0.0.1'
	}
};
digest.digestRequest(options, postData, "test", "test");
```