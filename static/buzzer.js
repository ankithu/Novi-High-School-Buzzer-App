var socket = io();
socket.on('message', function(data) {
  console.log(data);
});
console.log("code is running");
var buzzerHasBeenPressed = false;
var buzzer = false;
var isPlayer = true;
const greenGrad = "linear-gradient(90deg, rgba(41,103,17,1) 0%, rgba(0,255,6,1) 100%)";
const redGrad = "linear-gradient(90deg, rgba(168,14,14,1) 0%, rgba(255,124,56,1) 100%)";
const waitingGrad = "linear-gradient(90deg, rgba(249,240,0,1) 4%, rgba(0,230,255,1) 95%)";
var playerNum = -1;
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 32:
      buzzer = true;
      break;
  }
});
socket.emit('new player');


var button = document.getElementById("button");
var header = document.getElementById("head");
var connectButton = document.getElementById("connectButton");
console.log(header);

var serverButton = document.getElementById("createServer");

// // 2. Append somewhere
var body = document.getElementsByTagName("body")[0];


var message = document.getElementById("message");
console.log(message);
message.innerHTML = "BUZZ WHEN YOU ARE READY";

body.style.background = waitingGrad;
var socket = io.connect();
var serverForm = document.getElementById("serverF");
var playerForm = document.getElementById("playerF");
var userID = playerNum;
var waitingForStatus = false;
// 3. Add event handler
button.addEventListener ("click", function() {
  if (!buzzerHasBeenPressed){

      if (playerForm.value != ""){
        userID = playerForm.value;
      }
      buzzer = serverForm.value + ":" + userID;
      socket.emit('buzzer', buzzer);
      console.log('code has sent something');s
  }
});

connectButton.addEventListener ("click", function(){
  console.log('connect button action');
  if (isPlayer){
    socket.emit('serverDataRequest', serverForm.value);
    waitingForStatus = true;
  }
});

serverButton.addEventListener ("click", function(){
  console.log('has click');
  if (isPlayer){
    socket.emit('newServer', playerNum);
    socket.emit('logServer', serverForm.value);
    //body.removeChild(button);

    isPlayer = false;
    message.innerHTML = "Buzzers are ready";
    serverButton.innerHTML = "Reset Buzzers";
    var header = document.getElementById("head");
    header.innerHTML = "Room Host";

  }
  else{
    socket.emit('resetBuzzers', serverForm.value);
    body.style.background = waitingGrad ;
  }

});

socket.on('assignment', function(num){
  if (playerNum < 0){
    playerNum = num;
  }
});
socket.on('serverDataResponse', function(status){
  if (status.split(':')[0]==serverForm.value && waitingForStatus){
    if (status.split(':')[1]=="buzz"){
      someoneElseBuzzed();
    }
    waitingForStatus = false;
  }
});
socket.on('resetBuzzers', function(name){
  console.log(name);
  console.log(serverForm.value);
  if (name == serverForm.value){
    buzzerHasBeenPressed = false;
    body.style.background = waitingGrad;
    if (isPlayer){
      message.innerHTML = "BUZZ WHEN YOU ARE READY";
    }
    else{
      message.innerHTML = "Buzzers are ready";
    }
  }
  else{
    console.log('reset was for someone else');
  }
});

socket.on('buzzersStates', function(states){
  console.log("has states");
  console.log(states);
  console.log(playerNum);
  console.log(states.split(':')[1]);
  if (serverForm.value == states.split(':')[0]){
    if (isPlayer){
      if(userID == states.split(':')[1]){
        body.style.background = greenGrad;
        message.innerHTML = "Buzzed!";
        buzzerHasBeenPressed = true;
      }
      else{
        someoneElseBuzzed();
      }
    }
    else{
      message.innerHTML = states.split(':')[1] + " buzzed";
      body.style.background = greenGrad;
    }

    buzzerHasBeenPressed = true;

  }

});
function someoneElseBuzzed(){
  buzzerHasBeenPressed = true;
  body.style.background =  "linear-gradient(90deg, rgba(168,14,14,1) 0%, rgba(255,124,56,1) 100%)";
  message.innerHTML = "Someone else buzzed";
}
