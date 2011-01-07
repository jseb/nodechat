var http = require('http'),
    fs = require('fs'),
    url = require('url'),
	path = require('path')

var server = http.createServer(
    function(request, response) {
		var uri = url.parse(request.url).pathname;
		
		if(uri == "/") {
			uri = "/index.html";
		}

		var filename = path.join(process.cwd(), uri);
		if(filename == "/") {
			filename = "/index.html";
		}
		fs.readFile(
			filename,
			function(error, data) {
				var statuscode;
				var filecontent = "";

				if(error) {
					statuscode = 500;
				} else if (!data) {
					statuscode = 404;
				} else {
					statuscode = 200;
					filecontent = data;
				}

				switch(path.extname(uri.toLowerCase())) {
					case '.html':
					case '.htm':	
						contenttype = 'text/html';	
						break;
					case '.swf':
						contenttype = 'application/x-shockwave-flash';
						break;
					case '.css':
						contenttype = 'text/css';
						break;
					case '.js':
						contenttpe = 'text/javascript';
						break;
				}

				response.writeHead(
					statuscode,
					{
						'Content-Type': contenttype
					}
				);
				
				response.write(filecontent, "binary");	
				response.end();
			}
		);
    }
);
server.listen(1200);
console.log("fileserver accepting connections on port 1200");
