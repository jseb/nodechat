exports.Message = function(content, channel, nick) {
	return JSON.stringify(
		{
            "event": "message",
			"channel": channel,
			"nick": nick,
			"content": content,
			"ts": new Date()
		}
	);
}

exports.Nick = function(oldNick, newNick) {
	return JSON.stringify(
        {
            "event": "nick",
            "oldnick": oldNick,
            "newnick": newNick
        }
    );
}

exports.JoinPart = function(nick, type, channel) {
	return JSON.stringify(
		{
            "event": type,
			"nick": nick,
            "channel": channel,
			"ts": new Date()
		}
	);
}

exports.QuitDisconnect = function(nick, type) {
	return JSON.stringify(
		{
            "event": type,
			"nick": nick,
			"ts": new Date()
		}
	);
}

exports.Channel = function(type, channel) {
	return JSON.stringify(
		{
            "event": type, // created / abandoned
			"channel": channel,
			"ts": new Date()
		}
	);
}
