var io = require('/usr/local/lib/node/socket.io'),
	net = require('net'),
	http = require('http')

users = [];
channels = [];

function User(client, username) {
   	this.client = client;
   	this.username = username;
}

function Channel(name) {
	this.name = name;
	this.users = [];
	this.messages = [];
}

function Msg(message, channel, sysmsg, user) {
	var ev = sysmsg ? "sysmsg" : "msg";
	return JSON.stringify(
		{
			"event": ev,
			"channel": channel,
			"user": user,
			"message": message,
			"ts": new Date()
		}
	);
}

var server = net.createServer();
server.listen(8124);
console.log("--> created tcp server on port 8124, attaching socket.io");
var socket = io.listen(server); 

function broadcast(channel, message) {
	for (var i = 0; i < channel.users.length; i++) {
		channel.users[i].client.send(message);
	}
	channel.messages.add(message);
	if (channel.messages.length > 500) {
		channel.messages.pop();
	}
}

function nickAvailable(nick) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].username = nick) {
			return false;
		}
	}
	return true;
}

socket.on(
    'connection',
    function(client) {
        client.on(
            'message',
            function(data) {
				var clientrequest = eval('('+data+')');	            
				switch (clientrequest.event) {
					case 'join_server':
						var requestednick = clientrequest.nick;
						if (nickAvailable(requestednick)) {
							users.push(new User(client, requestednick));
							client.send(JSON.stringify({"event": "set_nick", "success": !nickTaken}));
							for (var i = 0; i < channels.length; i++) {
								client.send(
									JSON.stringify(
										{
											"event": "channels",
											"type": "add",
											"channel": channels[i]
										}
									)
								);
							}
						}
						break;
					default:
				}
            }
        )

        client.on(
            'disconnect',
            function() {
                users.splice(users.indexOf(user), 1);
				broadcast(sysmsg(user.username + " has disconnected"));
            }
        )
    }
); 
