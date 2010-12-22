// -- COMMANDS ----------------------------------------------------------------
exports.Nick = function(oldNick, newNick) {
	return JSON.stringify(
        {
            "command": "nick",
            "oldnick": oldNick,
            "newnick": newNick
        }
    );
}

exports.Join = function(nick, channel) {
	return JSON.stringify(
		{
            "command": "join",
			"nick": nick,
            "channel": channel,
			"ts": new Date()
		}
	);
}

exports.Part = function(nick, channel) {
	return JSON.stringify(
		{
            "command": "part",
			"nick": nick,
            "channel": channel,
			"ts": new Date()
		}
	);
}

exports.Quit = function(nick) {
	return JSON.stringify(
		{
            "command": "quit",
			"nick": nick,
			"ts": new Date()
		}
	);
}

// TODO: exports.Names = function()
// TODO: exports.List = function()
