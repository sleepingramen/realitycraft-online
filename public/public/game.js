const socket = io();

let me = {};

function create(){
  me = {
    name: document.getElementById("name").value || "Player",
    avatar: {
      hair: document.getElementById("hair").value,
      eyes: document.getElementById("eyes").value
    }
  };

  socket.emit("createPlayer", me);

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("me").innerText =
    `${me.name} (${me.avatar.hair}, ${me.avatar.eyes})`;
}

function battle(){
  socket.emit("battle");
}

function sendChat(){
  let msg = document.getElementById("chatInput").value;
  socket.emit("chat", msg);
}

socket.on("update", (players) => {
  let html = "";

  for(let id in players){
    html += `${players[id].name} ❤️ ${players[id].energy}<br>`;
  }

  document.getElementById("players").innerHTML = html;
});

socket.on("chat", (msg) => {
  document.getElementById("chat").innerHTML += msg + "<br>";
});

socket.on("question", (q) => {
  document.getElementById("question").innerHTML =
    `<h3>${q.q}</h3>
     <button onclick="answer('A','${q.correct}')">${q.a1}</button>
     <button onclick="answer('B','${q.correct}')">${q.a2}</button>`;
});

function answer(val, correct){
  socket.emit("answer", val, correct);
  document.getElementById("question").innerHTML = "";
}
