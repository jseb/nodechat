// -- COMMANDS ----------------------------------------------------------------
(function(exports){

exports.Nick = function(oldNick, newNick) {
	return JSON.stringify(
        {
            "command": "nick",
            "oldnick": oldNick,
            "newnick": newNick
        }
    );
}

exports.Join = function(channel) {
	return JSON.stringify(
		{
            "command": "join",
            "channel": channel
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



})(typeof exports === 'undefined'? this['json_commands']={}: exports);

