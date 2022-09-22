const webSocket = require("ws");
const port = 5000 || process.env.PORT;
const wsServer = new webSocket.Server({ port: port });

const gameInfo = { id: "", player1: "", player2: "" };

wsServer.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("message", (msg) => {
    const { method, gameId, location } = JSON.parse(msg);

    if (method === "createGame") {
      const GAME_ID = Math.floor(Math.random() * 90000) + 10000;
      const PLAYER1 = Math.floor(Math.random() * 90000) + 10000;
      gameInfo.id = GAME_ID;
      gameInfo.player1 = PLAYER1;
      let json = JSON.stringify(gameInfo);
      socket.send(json);
    }

    if (method === "joinGame") {
      if (gameId == gameInfo.id) {
        const PLAYER2 = Math.floor(Math.random() * 90000) + 10000;
        gameInfo.player2 = PLAYER2;
        let json = JSON.stringify(gameInfo);
        socket.send(json);
      }

      wsServer.clients.forEach((client) => {
        var data = {
          gameId,
          location,
          player1Id: gameInfo.player1,
          player2Id: gameInfo.player2,
        };
        data = JSON.stringify(data);
        client.send(data);
      });
    }
  });

  socket.on("close", () => {
    console.log("A client disconnected");
  });
});

console.log(new Date() + "Server is listening on port " + port);
