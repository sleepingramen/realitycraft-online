const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

  players[socket.id] = {
    name: "Guest",
    energy: 10,
    avatar: { hair: "Short", eyes: "Round" }
  };

  io.emit("update", players);

  socket.on("createPlayer", (data) => {
    players[socket.id] = {
      ...players[socket.id],
      ...data
    };
    io.emit("update", players);
  });

  socket.on("chat", (msg) => {
    if (!players[socket.id]) return;
    io.emit("chat", players[socket.id].name + ": " + msg);
  });

  socket.on("battle", () => {
    let p = players[socket.id];
    if (!p) return;

    p.energy--;

    if (p.energy <= 0) {
      socket.emit("question", {
        q: "Answer correctly to restore energy",
        a1: "A",
        a2: "B",
        correct: Math.random() > 0.5 ? "A" : "B"
      });
    }

    io.emit("update", players);
  });

  socket.on("answer", (val, correct) => {
    if (!players[socket.id]) return;

    if (val === correct) {
      players[socket.id].energy = 10;
    }

    io.emit("update", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("update", players);
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("RealityCraft running on port", PORT);
});
