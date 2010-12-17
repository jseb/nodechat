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

connected_users = [];
msg_buffer = [];
channels = [];

function User(client, username) {
   	this.client = client;
   	this.username = username;
	this.channels = [];	
}

function log(message) {
	msg_buffer.push(message);
	if (msg_buffer.length > 400) {
		msg_buffer.pop();
	}
}

function sysmsg(message) {
	return JSON.stringify(
		{
			"type": "sys",
			"message": message,
			"ts": new Date()
		}
	);
}

var socket = io.listen(server); 

function broadcast(channel, message) {
	for (var i = 0; i < users.length; i++) {
		var user = users[i];
		if (user.channel == channel) {
			user.client.send(message);
		}
	}
	log(message);
	socket.broadcast(message);
}

function nickAvailable(nick) {
	for (var i = 0; i < connected_users.length; i++) {
		if (connected_users[i].username = nick) {
			return false;
		}
	}
	return true;
}

socket.on(
    'connection',
    function(client) {
        connected_users[connected_users.length - 1].client = client;
        var user = connected_users[connected_users.length - 1];

		for (var i = 0; i < msg_buffer.length; i++) {
			client.send(msg_buffer[i]);
		}
		broadcast(sysmsg(user.username + " has connected to server"));

        client.on(
            'message',
            function(data) {
				var clientrequest = eval('('+data+')');	            
				switch (clientrequest.action) {
					case 'join_server':
						var requestednick = clientrequest.nick;
						if (nickAvailable(requestednick)) {
							connected_users.push(new User(client, requestednick));
							client.send(JSON.stringify({"action": "set_nick", "success", !nickTaken}));
							for (var i = 0; i < channels.length; i++) {
								client.send(
									JSON.stringify(
										{
											"action": "channelupdate",
											"event": "add",
											"channel": channels[i]
										}
									)
								);
							}
						}
						break;
					case 'setnick':
						var requestednick = clientrequest.nick;
						if (nickAvailable(requestednick) {
							connected_users[connected_users.indexOf(user)].username = requestednick;
						}
						client.send(JSON.stringify({"action": "setnick", "success", !nickTaken}));
						break;
					case 'join':
						var channel = clientrequest.channel;
						var channelExists = channels.indexOf(channel) > -1;
						if (!channelExists) {
						channels.push(channel);
						}
						user.channels.push(channel);
						client.send(
							JSON.stringify(
						break;
					case 'getnames':
						// clientrequest.channel
						break;
					case 'quit':
						// clientrequest.nick, clientrequest.channel
						break;
					case 'part':
						// clientrequest.nick, clientrequest.channel
						break
					default:
				}

                data = data.toString().trim();
                if (data == "/names") {
                    client.send(sysmsg("connected users"));
                    for (var i = 0; i < connected_users.length; i++) {
						client.send(sysmsg(connected_users[i].username));
                    }
                } else {
					var message = JSON.stringify(
						{
							"type": "usr",
							"user": user.username,
							"message": data,
							"ts": new Date()
						}
					);
					broadcast(message);
                }
            }
        )

        client.on(
            'disconnect',
            function() {
                connected_users.splice(connected_users.indexOf(user), 1);
				broadcast(sysmsg(user.username + " has disconnected"));
            }
        )
    }
); 
