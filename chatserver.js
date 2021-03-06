var io = require('./server_lib/socket.io'),
	http = require('http'),
    json_events = require('./json_events'),
    json_commands = require('./json_commands')

var users = [];
var channels = [];

function User(client, nick) {
   	this.client = client;
   	this.nick = nick;
    this.channels = [];
}

function Channel(name) {
	this.name = name;
	this.users = [];
	this.messages = [];
}

var server = http.createServer();
server.listen(8124);
console.log("--> created http server on port 8124, attaching socket.io");
var socket = io.listen(server); 

function sendChannelMessage(channelName, message) {
    for (var ch = 0; ch < channels.length; ch++) {
        if (channels[ch].name == channelName) {
            for (var i = 0; i < channel.users.length; i++) {
                channel.users[i].client.send(message);
            }
            channel.messages.add(message);
            if (channel.messages.length > 500) {
                channel.messages.pop();
            }
        }
    }
}

function sendUserMessage(user, message) {
    if (user.channels) {
        for (var i = 0; i < user.channels.length; i++) {
            sendChannelMessage(user.channels[i].name, message); 
        }
    }
}

/*
function sendGlobalMessage(message) {
    for (var i = 0; i < users.length; i++) {
        users[i].client.send(message);
    }
}
*/

function nickExists(nick) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].username == nick) {
			return true;
		}
	}
	return false;
}

function channelUsers(channelName) {
    for (var i = 0; i < channels.length; i++) {
        if (channels[i].name == channel) {
            return channels[i].users.length;
        }
    }
    return 0;
}

function channelExists(channelName) {
    return channelUsers(channelName) > 0;
}

socket.on(
    'connection',
    function(client) {
        var user = new User(client, "");
        users.push(user);
        client.on(
            'message',
            function(data) {
                var json = JSON.parse(data);
				switch (json.command) {
                    case 'join':
                        var channelName = json.channel;
                        if (!channelExists(channelName)) {
                            var channel = new Channel(channelName);
                            channels.push(channel);
                        }
                        user.channels.push(channelName);
                        sendChannelMessage(channelName, json_commands.Join(user.nick, "join", channel));
                        // TODO: send buffer to client
                        break;
                    /* TODO:
                    case 'list':
                        break;
                    case 'names':
                        break;
                    */
                    case 'nick':
						console.log(json.newnick);
                        var requestedNick = json.newnick;
                        if (!nickExists(requestedNick)) {
                            sendUserMessage(json_commands.Nick(user.nick, requestedNick));
                            user.client.send(json_commands.Nick(user.nick, requestedNick));
                            user.nick = requestedNick; 
                        } else {
                            user.client.send(json_commands.Nick(user.nick, user.nick));
                        }
                        break;
                    case 'part':
                        var channelName = json.channel;
                        if (channelExists(channelName)) {
                            user.channels.splice(user.channels.indexOf(channelName), 1);
                            sendChannelMessage(channelName, json_commands.Part(user.nick, channelName));
                        }
                        if (channelUsers(channelName) < 1) {
                            for (var i = 0; i < channels; i++) {
                                if (channels[i].name == channelName) {
                                    channels.splice(channels[i]);
                                }
                            }
                            // sendGlobalMessage(json_events.Channel("abandoned", channelName));
                        }
                        break;
                    case 'quit':
                        users.splice(users.indexOf(user), 1);
                        sendUserMessage(json_commands.Quit(user.nick));
                        break;
                }
                switch (json.event) {
                    case 'message':
                        var channelName = json.channel;
                        var content = json.content;
                        sendChannelMessage(channelName, json_events.Message(content, channel, user.nick));
                        break;
                    case 'disconnect':
                        // TODO
                        break;
                    case 'channelstarted':
                        // TODO
                        break;
                    case 'channelabandoned':
                        // TODO
                        break;
                }
            }
        )

        client.on(
            'disconnect',
            function() {
                // TODO
            }
        )
    }
); 
