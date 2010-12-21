function Message(content, channel, nick) {
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

function Nick(oldNick, newNick) {
	return JSON.stringify(
        {
            "event": "nick",
            "oldnick": oldNick,
            "newnick": newNick
        }
    );
}

function JoinPart(nick, type, channel) {
	return JSON.stringify(
		{
            "event": type,
			"nick": nick,
            "channel": channel,
			"ts": new Date()
		}
	);
}

function QuitDisconnect(nick, type) {
	return JSON.stringify(
		{
            "event": type,
			"nick": nick,
			"ts": new Date()
		}
	);
}

function Channel(type, channel) {
	return JSON.stringify(
		{
            "event": type, // created / abandoned
			"channel": channel,
			"ts": new Date()
		}
	);
}
