var username;
var channels = []; 
var active_channel;

var socket = new io.Socket(null,{'port':'8124'}); 

socket.on(
	'connect',
	function(data) {
		displayInfo("Welcome! Please enter your username!");
		$('#nickselection').show();
	})



socket.on(
    'message',
    function(data) {
    var data = eval('('+data+')');	            
    if(!data) return; //Junkdata
	console.log(data);
	if(data.command) {
		console.log("Command received");
		handleCommand(data);
		return;
	}
	if(data.event) {
		console.log("Event received");
		handleEvent(data);
		retur;
	}

})

function handleCommand(jsonData) {
	switch(jsonData.command) {
		case 'nick':
			if(!jsonData.oldnick) { //Inget oldnick, det här är ett försök till en inloggning
				if(jsonData.newnick) {
					username = jsonData.newnick;
					displayInfo("Welcome "+username+"!");
					$('#nickselection').hide();
					$('#channelcreate').show();
				}
				else {
					displayError("Username occupied, please choose another one!");
				}
				$('#login_username').val("")
				break;
			}
			else if(jsonData.oldnick == jsonData.newnick) { //Gick inte att byta
				displayError("Username already taken");
				break;
			}
			username = jsonData.newnick;
			break;
		case 'join':
			var channel = jsonData.channel;
			if(!channel) {
				displayError("An error occoured while trying to join or create a channel");
				break;
			}
    		createChannelWindow(channel);
			openChannelWindow(channel);			
			break;
	}
}

function handleEvent(jsonData) {
	switch(jsonData.event) {
		case 'join':
			
			break;
	}
}


function fixTime(time) {
if(time < 10) return "0"+time; return time;
}

function sendData() {
    var element = document.getElementById('field');
    var input = element.value.trim();
    if (input) {
        if (input == "/quit") {
            socket.disconnect();
            document.getElementById('output').innerHTML += "<span class=\"client_info\">" + "---> you have disconnected" + "</span><br />";
        } 
    else if (input == "/clear"){
    document.getElementById('output').innerHTML = "";
    }
    else {
            socket.send(input);
        }
        element.value = '';
    }
}


function sendData() {
    var cmd = $('#input').val();
}

function updateChannels() {
    $("#channellist").hide().html("");
    if(channels.length == 0) return;
    var chanList = "<ul>";
        for(var i=0;i<channels.length;i++) {
            chanList += "<li><a href=\"javascript:joinChannel('"+channel[i]+"')\">"+channel[i]+"</a></li>";					
        }
    chanList += "</ul>";

    $('#channellist').html(chanList);

    if(channels.length > 0) {
        $('#channellist').show(0);
    } else {
        $('#channellist').hide(0);
    }
}

function joinChannel(channel) {
    if(!channel) return;
	console.log(json_commands.Join(channel));
    socket.send(json_commands.Join(channel));
}

function createChannelWindow(channel_name) {
    $("#active_channels").append("<li>"+channel_name+"</li>");
    $("#output").append("<div class=\"channel_window\" id=\""+channel_name+"\"></div>");
	channels.push(channel_name);
}

function destroyChannelWindow(channel_name) {

}

function openChannelWindow(channel_name) {
	$("#output").show();
	$("#input_field").show();
    $("#output").each(function(){
        $(this).hide();
    });
    $('"#"+channel_name').show();
    active_channel = channel_name;
    $("#active_channels").each(function() {
        $(this).removeClass("active_channel_tab");
        if($(this).text() == channel_name) {
            $(this).addClass("active_channel_tab");				
        }
    });
}

function login() {
    var nick = $('#login_username').val();
	console.log("Trying to login with nick: "+nick);
    if(!(nick.trim())) {
        displayError("Skriv in ett nick!");
    }
	console.log(json_commands.Nick("",nick));
    socket.send(json_commands.Nick("",nick));
}

function displayInfo(info) {
	if(!info) return;
    $('#errorframe').hide();
    $('#infoframe').hide().text(info).show();

}
function displayError(error) {
    if(!error) return;
	$('#infoframe').hide();
    $('#errorframe').hide().text(error).show();
}

$(document).ready(function(){
	socket.connect();
});
