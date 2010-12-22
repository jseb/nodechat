var io = require('/usr/local/lib/node/socket.io'),
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

function sendChannelMessage(channel, message) {
	for (var i = 0; i < channel.users.length; i++) {
		channel.users[i].client.send(message);
	}
	channel.messages.add(message);
	if (channel.messages.length > 500) {
		channel.messages.pop();
	}
}

function sendUserMessage(user, message) {
    for (var i = 0; i < user.channels.length; i++) {
        sendChannelMessage(user.channels[i], message); 
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

function channelUsers(channelname) {
    for (var i = 0; i < channels.length; i++) {
        if (channels[i].name == channel) {
            return channels[i].users.length;
        }
    }
    return 0;
}

function channelExists(channelname) {
    return channelUsers(channelname) > 0;
}

socket.on(
    'connection',
    function(client) {
        users.push(new User(client, ""));
        client.on(
            'message',
            function(data) {
                var json = JSON.parse(data);
				switch (json.command) {
                    case 'join':
                        var channel = json.channel;
                        if (!channelExists(channel)) {
                            channels.push(json_events.Channel(channel));
                            user.channels.push(channel);
                            // sendGlobalMessage(json_events.Channel("created", channel));
                        }
                        sendChannelMessage(channel, json_commands.Join(user.nick, "join", channel));
                        // TODO: send buffer to client
                        break;
                    /* TODO:
                    case 'list':
                        break;
                    case 'names':
                        break;
                    */
                    case 'nick':
                        var requestedNick = json.requestedNick;
                        if (!nickExists(requestedNick)) {
                            sendUserMessage(json_commands.Nick(user.nick, requestedNick));
                            user.nick = requestedNick; 
                        }
                        break;
                    case 'part':
                        var channelname = json.channel;
                        if (channelExists(channelname)) {
                            user.channels.splice(user.channels.indexOf(channelname), 1);
                            sendChannelMessage(json_commands.Part(user.nick, channelname));
                        }
                        if (channelUsers(channelname) < 1) {
                            for (var i = 0; i < channels; i++) {
                                if (channels[i].name == channelname) {
                                    channels.splice(channels[i]);
                                }
                            }
                            // sendGlobalMessage(json_events.Channel("abandoned", channelname));
                        }
                        break;
                    case 'quit':
                        users.splice(users.indexOf(user), 1);
                        sendUserMessage(json_commands.Quit(user.nick));
                        break;
                }
                switch (json.event) {
                    case 'message':
                        var channel = json.channel;
                        var content = json.content;
                        sendChannelMessage(channel, json_events.Message(content, channel, user.nick));
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
