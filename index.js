let http = require('http');
let crypto = require('crypto');

let md5 = (data) => {
	let md5 = crypto.createHash('md5');
	let result = md5.update(data).digest('hex');

	return result;
}

let digestRequest = (options, data, user, pass, cb) => {
	const req = http.request(options, (res) => {
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		
		if (res.statusCode == 401) {
			let cnonce = md5(String(new Date().getTime()));
			let auth = res.headers["www-authenticate"];
			let realm, nonce, qop;
			let authSplit = auth.split(",");
			
			for (let k of authSplit) {
				if (authSplit[k].indexOf("realm=") >= 0) {
					let realmSplit = authSplit[k].split("=\"");
					realm = realmSplit[realmSplit.length - 1];
					realm = realm.substring(0, realm.length - 1);
				}
				
				if (authSplit[k].indexOf("nonce=") >= 0) {
					let nonceSplit = authSplit[k].split("=\"");
					nonce = nonceSplit[nonceSplit.length - 1];
					nonce = nonce.substring(0, nonce.length - 1);
				}
				
				if (authSplit[k].indexOf("qop=") >= 0) {
					let qopSplit = authSplit[k].split("=\"");
					qop = qopSplit[qopSplit.length - 1];
					qop = qop.substring(0, qop.length - 1);
				}
			}			
						
			let HA1 = md5(user + ":" + realm + ":" + pass);
			let HA2 = md5(options.method + ":" + options.path);
			let response = md5(HA1 + ":" + nonce + ":00000001:" + cnonce + ":" + qop + ":" + HA2);
			options.headers.Authorization = "Digest username=\"" + user + "\",realm=\"" + realm + "\",nonce=\"" + nonce + "\",uri=\"" + options.path + "\",cnonce=\"" + cnonce + "\",nc=00000001,algorithm=MD5,response=\"" + response + "\",qop=\"" + qop + "\"";
			request(options, data, cb);
		} else {
			console.error("status code failed!!");
			cb("status code failed!!", null);
			return;
		}
		
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		res.on('end', () => {
		});
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
	
	if (data) {
		req.write(data);
	}
	
	req.end();
}

let request = (options, data, cb) => {
	const req = http.request(options, (res) => {
		let resData;
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
			resData += chunk;
		});
		res.on('end', () => {
			cb(null, resData);
		});
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
	
	if (data) {
		req.write(data);
	}
	
	req.end();
}

exports.digestRequest = digestRequest;
