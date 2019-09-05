let should = require('should');
let digest = require('../index');

describe('#Digest', () => {
	it('digest authentication.', done => {
		const postData = "Hello World\r\n";
		
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
		
		let GetData = (err, data) => {
			if (err) {
				console.error(err);
			} else {
				console.log(data);
			}
		}

		digest.digestRequest(options, postData, "test", "test", GetData);
		
		done();
	})
	
})
