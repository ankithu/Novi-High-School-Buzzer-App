// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var playerIDDict = {};
var serverIDDict = {};
var serverStatusDict = {};
var serverNum = 1000;
var currentPlayerAssignment = 0;
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
const port=process.env.PORT || 3000
server.listen(port,() => {
console.log(`Server running at port `+port);
});
// // Starts the server.
// server.listen(5000, '0.0.0.0',function() {
//    console.log(server.address());
//    console.log('Starting server on port 5000');
// });
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var buzzerStates = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    console.log(socket.id);
   playerIDDict[socket.id] =  currentPlayerAssignment;
    io.sockets.emit('assignment', currentPlayerAssignment);
    currentPlayerAssignment++;
    buzzerStates[playerIDDict[socket.id]] = false;
  });
  socket.on('buzzer', function(buzz){
    playerId = buzz.split(':')[1];
    serverId = buzz.split(':')[0];
    console.log('has buzz from' + buzz);
    console.log(buzz);
    serverStatusDict[serverId] = "buzz";
    io.sockets.emit('buzzersStates', buzz);
  });
  socket.on('newServer', function(playerID){
    serverIDDict[serverNum] = playerID;
  });
  socket.on('logServer', function(serverName){
    serverStatusDict[serverName] = "reset";
  })
  socket.on('resetBuzzers', function(serverName){
    console.log(serverName);
    serverStatusDict[serverName] = "reset";
    io.sockets.emit('resetBuzzers', serverName);
  });
  socket.on('serverDataRequest', function(serverName){
    io.sockets.emit('serverDataResponse', (serverName+ ':' + serverStatusDict[serverName]));
  });

});
