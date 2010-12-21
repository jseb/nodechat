var io = require('/usr/local/lib/node/socket.io'),
	http = require('http'),
    json = require('./json_events')

console.log(json);
var test = json.Nick("newnick", "oldnick");

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

function sendGlobalMessage(message) {
    for (var i = 0; i < users; i++) {
        users[i].client.send(message);
    }
}

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
        client.on(
            'message',
            function(data) {
				var clientrequest = eval('(' + data + ')');	            
				switch (clientrequest.event) {
                    case 'join':
                        var channel = clientrequest.channel;
                        if (!channelExists(channel)) {
                            channels.push(json.Channel(channel));
                            user.channels.push(channel);
                            sendGlobalMessage(json.Channel("created", channel));
                        }
                        sendChannelMessage(channel, json.JoinPart(user.nick, "join", channel));
                        // TODO: send buffer to client
                        break;
                    case 'list':
                        for (var i = 0; i < channels.length; i++) {
                            client.send(json.Channel("", channels[i].name));
                        }
                        break;
                    case 'msg':
                        var channel = clientrequest.channel;
                        var content = clientrequest.content;
                        sendChannelMessage(channel, json.Message(content, channel, user.nick));
                        break;
                    case 'names':
                        var channel = clientrequest.channel;
                        var channelUsers = channels[channels.indexOf(channel)].users;
                        for (var i = 0; i < channelUsers.length; i++) {
                           client.send(json.Nick(channelUsers.nick, "")); 
                        }
                        break;
                    case 'nick':
                        var requestedNick = clientrequest.requestedNick;
                        if (!nickExists(requestedNick)) {
                            user.nick = requestedNick; 
                            sendUserMessage(json.Nick(requestedNick, user.nick));
                        }
                        break;
                    case 'part':
                        var channelname = clientrequest.channel;
                        if (channelExists(channelname)) {
                            user.channels.splice(user.channels.indexOf(channelname), 1);
                            sendUserMessage(json.Notification(user.nick, "part", channelname));
                        }
                        if (channelUsers(channelname) < 1) {
                            for (var i = 0; i < channels; i++) {
                                if (channels[i].name == channelname) {
                                    channels.splice(channels[i]);
                                }
                            }
                            sendGlobalMessage(json.Channel("abandoned", channelname));
                        }
                        break;
                    case 'quit':
                        users.splice(users.indexOf(user), 1);
                        sendUserMessage(json.Notification(user.nick, "quit", ""));
                        break;
					default:
				}
            }
        )

        client.on(
            'disconnect',
            function() {
                // handleQuit();
            }
        )
    }
); 
