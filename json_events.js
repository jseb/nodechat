// -- EVENTS ------------------------------------------------------------------
(function(exports){
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

/*
exports.Disconnect = function(nick) {
	return JSON.stringify(
		{
            "event": "disconnect",
			"nick": nick,
			"ts": new Date()
		}
	);
}

exports.ChannelStarted = function(channel) {
	return JSON.stringify(
		{
            "event": "channelstarted",
			"channel": channel,
			"ts": new Date()
		}
	);
}

exports.ChannelAbandoned = function(channel) {
	return JSON.stringify(
		{
            "event": "channelabandoned",
			"channel": channel,
			"ts": new Date()
		}
	);
}
*/
})(typeof exports === 'undefined'? this['json_events']={}: exports);
