const { Server } = require("socket.io");

const io = new Server(9000, {
  cors: true,
});
const etsMap = new Map();
const steMap = new Map();
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join", (data) => {
    const { email, room } = data;

    etsMap.set(email, socket.id);

    steMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  socket.on("peer:nego:needed", ({ to, offer }) => {
   
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
  
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
