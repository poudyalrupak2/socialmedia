const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000", // Allow the frontend to connect
  },
});

let activeUsers = []; // Array to keep track of active users

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for a new user joining and add them to active users
  socket.on("new-user-add", (newUserId) => {
    // If the user is not already active, add them
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected:", activeUsers);
    }
    // Emit the updated active users list to all connected clients
    io.emit("get-users", activeUsers);
  });

  // Listen for a user disconnecting and remove them from active users
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected:", socket.id);
    // Broadcast the updated list of active users to all clients
    io.emit("get-users", activeUsers);
  });

  // Listen for sending a message
  socket.on("send-message", (data) => {
    const { receiverId, senderId } = data;
    const receiver = activeUsers.find((user) => user.userId === receiverId);
    const sender = activeUsers.find((user) => user.userId === senderId);

    console.log("Message data received on server:", data);

    // Send message to the intended receiver if they're connected
    if (receiver) {
      console.log(`Sending message from ${senderId} to ${receiverId}`);
      io.to(receiver.socketId).emit("receive-message", data);
    } else {
      console.log(`Receiver with ID ${receiverId} not connected`);
    }

    // Optionally send the message back to the sender for confirmation or local update
    if (sender) {
      io.to(sender.socketId).emit("receive-message", data);
    }
  });
});
