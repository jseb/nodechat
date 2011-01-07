var username;
var nameupdate; //Tmp Holder
var channels = []; 
var active_channel;

var socket = new io.Socket({'port','8124'}); 

socket.connect();
socket.on(
    'message',
    function(data) {
    var data = eval('('+data+')');	            
    if(!data) return; //Junkdata

    var event = data.event;
    if(!event) return;

    if(event == "set_nick") {
    if(!data.success) {
        displayError("Nicket upptaget, vänligen välj ett annat");
        return;
    }
    username = nameupdate;
    return;
    }

    if(event == "channels") {
    if(data.type == "add") {
        channels.push(data.channel);
    }
    else if(data.type == "remove") {
        channels.splice(channels.indexOf(data.channel),1);
    }
    updateChannels();
    return;
    }
    
    if(event == "sysmsg") {
    return;	
    }

    if(event == "msg") {
         var timestamp;
     if(info.ts) {
         d = new Date(info.ts);	
         timestamp = fixTime(d.getHours())+":"+fixTime(d.getMinutes())+":"+fixTime(d.getSeconds());
     }
     else {
        timestamp = new Date();
        timestamp = fixTime(timestamp.getHours)+":"+fixTime(timestamp.getMinutes())+":"+fixTime(timestamp.getSeconds());
     }
     
     timestamp = "<span class=\"timestamp\">"+timestamp+"</span>";

     var msg = info.msg;

     var user =  "<span class=\"username";
     if(msg.indexOf(username) > -1) {
        user += " highlight";
     }
         user += "\">"+info.user+"</span>";
    
     msg = "<span class=\"user_message\">"+msg+"</span><br />\n";

    $('"#"+info.channel).append(timestamp+user+msg);
    return;
    }

     
/*   
   
    if(info.type == "sys") {
     document.getElementById('output').innerHTML += "<span class=\"timestamp\">"+timestamp+"</span><span class=\"system_msg\"> ---> " + info.message + "</span><br />";
    }
    else if(info.type == "usr") {
     document.getElementById('output').innerHTML += "<span class=\"timestamp\">"+timestamp+"</span><span class=\"username\">"+ info.user +"</span><span class=\"user_message\">"+ info.message +"</span><br />";
    }*/
    }
)

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
    var cmd = JSON.stringify({"action":"join","channel":channel});
    socket.send(cmd);
    createChannelWindow(channel);
    openChannelWindow(channel);
}

function createChannelWindow(channel_name) {
    $("#active_channels").append("<li>"+channel_name+"</li>");
    $("#output").append("<div class=\"channel_window\" id=\""+channel_name+"\"></div>");
}

function destroyChannelWindow(channel_name) {

}

function openChannelWindow(channel_name) {
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
    if(!(nick.trim())) {
        displayError("Skriv in ett nick!");
    }
    var cmd = JSON.stringify({"event":"join_server","nick":nick});	
    socket.send(cmd);
    nameupdate = nick;
}

function displayError(error) {
    if(!error) return;
    $('#errorframe').hide().text(error).show();
}
