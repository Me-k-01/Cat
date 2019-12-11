const io = require("socket.io")(3000)  // Ouverture du server sur le port 3000

var users = {}

io.on("connection", socket => {  // Lorsqu'une connection au socket est fait
  socket.on("new-user", (name = "noob") => {  // Si c'est un nouvelle utilisateur
    if (! name) { name = "Lama";}
    users[socket.id] = name ;  // Ajout du nom dans l'objets stockant les utilisateurs.
    const userName = `${users[socket.id]}#${socket.id}`

    console.log(`${userName} as joined.`);
    socket.broadcast.emit("server", `${name} a rejoint le salon.`);
    socket.emit("server", "Bienvenue!");
  });


  socket.on("new-message", data => {
    if (data["user"] && data["txt"] != "") {
      const txt = `${data["user"]} :  ${data["txt"]}`  // Si on ne peux pas concagener c'est que le script a été modifié.
      console.log(txt);
      socket.emit("your-message", txt)
      socket.broadcast.emit( "chat-message", txt );
    }
  });

  socket.on("disconnect", () => {  // Si c'est un nouvelle utilisateur
    const userName = `${users[socket.id]}#${socket.id}`
    console.log(`${userName} disconnected.`);
    socket.broadcast.emit("server", `${users[socket.id]} a quitté le salon.`);
  });
});
