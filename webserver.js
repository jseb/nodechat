var http = require('http'),  
    io = require('/usr/local/lib/node/socket.io'), // for npm, otherwise use require('./path/to/socket.io') 
    fs = require('fs'),
    url = require('url'),
    q = require('querystring')

server = http.createServer(
    function(req, res) { 
        switch(url.parse(req.url).pathname) {
            case '/socket':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('socket.io.js'));
                res.end(); 
                break;
            case '/style':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('style.css'));
                res.end(); 
                break;
            case '/chat':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('client.html'));
                res.end(); 
                break;
            case '/join':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                var requestedNick = url.parse(req.url, true).query.nick;
                var channel = url.parse(req.url, true).query.channel;
				var channelActive = false;
				for (var i = 0; i < channels.length; i++) {
					if (channels[i] == channel) {
						channelActive = true;
					}
				}
                var nickTaken = false;
                for (var i = 0; i < connected_users.length; i++) {
                    if (connected_users[i].username == requestedNick) {
                        nickTaken = true;
                        var response = fs.readFileSync('index.html');
                        response += "<h2>nick name already in use</h2>";
                        res.write(response);
                        res.end();
                    }
                }
                if (!nickTaken) {
					if (!channelActive) {
						channels.push(channel);
					}
                    user = new User(null, requestedNick, channel);
                    connected_users.push(user);
                    res.write(fs.readFileSync('client.html'));
                    res.end(); 
                }
                break;
            default: 
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('index.html'));
                res.end(); 
                break;
        }
    }
);
server.listen(8124);
