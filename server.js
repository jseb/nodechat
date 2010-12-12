var http = require('http'),  
    io = require('/usr/local/lib/node/socket.io'), // for npm, otherwise use require('./path/to/socket.io') 
    fs = require('fs'),
    url = require('url'),
    q = require('querystring')

server = http.createServer(
    function(req, res) { 
        switch(url.parse(req.url).pathname) {
            case '/socket':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('socket.io.js'));
                res.end(); 
                break;
            case '/style':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('style.css'));
                res.end(); 
                break;
            case '/chat':
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('client.html'));
                res.end(); 
                break;
            case '/join':
                user = new User(null, url.parse(req.url, true).query.nick);
                connected_users.push(user);
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('client.html'));
                res.end(); 
                break;
            default: 
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                ); 
                res.write(fs.readFileSync('index.html'));
                res.end(); 
                break;
        }
    }
);
server.listen(8124);

connected_users = [];

function User(client, username) {
   this.client = client;
   this.username = username;
}

var socket = io.listen(server); 
socket.on(
    'connection',
    function(client) { 
        connected_users[connected_users.length - 1].client = client;
        var user = connected_users[connected_users.length - 1];
        socket.broadcast("--> " + user.username + " has connected to server.\n");

        client.on(
            'message',
            function(data) {
                data = data.toString().trim();
                if (data == "/names") {
                    client.send("--> connected users");
                    for (var i = 0; i < connected_users.length; i++) {
                        client.send(connected_users[i].username + "\n");
                    }
                } else {
                    socket.broadcast(user.username + " says: " + data + "\n");
                }
            }
        ) 

        client.on(
            'disconnect',
            function() {
                connected_users.splice(connected_users.indexOf(user), 1);
                socket.broadcast("--> " + user.username + " has disconnected.\n");
            }
        ) 
    }
); 
