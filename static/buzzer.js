var socket = io();
socket.on('message', function(data) {
  console.log(data);
});
console.log("code is running");
var buzzerHasBeenPressed = false;
var buzzer = false;
var isPlayer = true;
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
button.innerHTML = "Buzz";

var serverButton = document.getElementById("createServer");

// // 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var message = document.getElementById("message");
message.innerHTML = "BUZZ WHEN YOU ARE READY";


body.appendChild(message);
var socket = io.connect();
var serverForm = document.getElementById("serverF");
var playerForm = document.getElementById("playerF");
var userID = playerNum;
// 3. Add event handler
button.addEventListener ("click", function() {
  if (!buzzerHasBeenPressed){

      if (playerForm.value != ""){
        userID = playerForm.value;
      }
      buzzer = serverForm.value + ":" + userID;
      socket.emit('buzzer', buzzer);
      console.log('code has sent something')
  }
});



serverButton.addEventListener ("click", function(){
  if (isPlayer){
    socket.emit('newServer', playerNum);
    body.removeChild(button);

    isPlayer = false;
    message.innerHTML = "Buzzers are ready";
    serverButton.innerHTML = "Reset Buzzers";
  }
  else{
    socket.emit('resetBuzzers', serverForm.value);
    body.style.background = "yellow";
  }

});

socket.on('assignment', function(num){
  if (playerNum < 0){
    playerNum = num;
  }
});
socket.on('resetBuzzers', function(name){
  console.log(name);
  console.log(serverForm.value);
  if (name == serverForm.value){
    buzzerHasBeenPressed = false;
    body.style.background = "yellow";
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
        body.style.background = "green";
        message.innerHTML = "Buzzed!";
        buzzerHasBeenPressed = true;
      }
      else{
        buzzerHasBeenPressed = true;
        body.style.backgroundColor = "red";
        message.innerHTML = "Someone else buzzed";
      }
    }
    else{
      message.innerHTML = states.split(':')[1] + " buzzed";
      body.style.background = "green";
    }

    buzzerHasBeenPressed = true;

  }

});
