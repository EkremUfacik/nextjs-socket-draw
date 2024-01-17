import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected`);
  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });
});

server.listen(8000, () => {
  console.log(`Server is listening on port 8000`);
});
