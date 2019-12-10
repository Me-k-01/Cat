const io = require("socket.io")(3000)  // Ouverture du server sur le port 3000

io.on("connection", socket => {
  console.log("A new user as joined.");
  socket.emit("chat-message", "Bienvenue!");

  socket.on("new-message", data => {
    if (data["user"] && data["txt"] != "") {
      const txt = data["user"] + " : " + data["txt"]  // Si on ne peux pas concagener c'est que le script a été modifié.
      console.log(txt);
      socket.broadcast.emit("chat-message", txt );
    }

  });
});
