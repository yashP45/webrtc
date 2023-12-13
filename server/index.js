// const { Server } = require("socket.io");

// const io = new Server(9000, {
//   cors: true,
// });
// const etsMap = new Map();
// const steMap = new Map();
// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
//   socket.on("join", (data) => {
//     const { email, room } = data;

//     etsMap.set(email, socket.id);

//     steMap.set(socket.id, email);

//     io.to(room).emit("user:joined", { email, id: socket.id });
//     socket.join(room);
//     io.to(socket.id).emit("join", data);
//   });

//   socket.on("user:call", ({ to, offer }) => {
//     io.to(to).emit("incomming:call", { from: socket.id, offer });
//   });

//   socket.on("call:accepted", ({ to, ans }) => {
//     io.to(to).emit("call:accepted", { from: socket.id, ans });
//   });
//   socket.on("peer:nego:needed", ({ to, offer }) => {

//     io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//   });

//   socket.on("peer:nego:done", ({ to, ans }) => {

//     io.to(to).emit("peer:nego:final", { from: socket.id, ans });
//   });
// });

// const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: true,
});
const users = [];
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  users.push(socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.emit("user:joined", users);
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// server.listen(5000, () => console.log("server is running on port 5000"));
