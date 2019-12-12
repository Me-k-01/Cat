const io = require("socket.io")(3000)  // Ouverture du server sur le port 3000
const randomName = require("./name.json")

var users = {}

function createName() {
  // choix random des indices
  const i = Math.trunc(Math.random() * randomName["nam"].length);
  const j = Math.trunc(Math.random() * randomName["adj"].length);
  return randomName["nam"][i] + "-" + randomName["adj"][j];
  }

io.on("connection", socket => {  // Lorsqu'une connection au socket est fait
    socket.on("name", ( name = "" ) => {
    /* Lorsque on veux ajouter un nouvelle utilisateur ou changer son nom */
    if (name == "null") {name = ""}

    name = name.trim();  // On retire une premiere fois les espace a la fin et au debut
    if ( name.length > 10 ) {  // Si le nom est trop
      name = name.slice(0, 10);
      name = name.trim(); }

    if ( name == "" ) { name = createName(); }

    if  ( users[socket.id] ) {  // Si l'utilisateur s'est deja connecté
      if ( users[socket.id] != name ) {  // Et que son nouveau nom est bien different de l'ancien:

        users[socket.id] = name ;  // Changement du nom dans l'objets stockant les utilisateurs.

        console.log(`${users[socket.id]} as became: ${name}`);
        socket.broadcast.emit("server", `${users[socket.id]} est devenu ${name}.`);
        socket.emit("server", `Vous etes devenu ${name}`);
      }
    } else {  // Lorsqu'on se connecte pour la premiere fois (car le nom n'exite pas)
      users[socket.id] = name ;  // Ajout du nom dans l'objets stockant les utilisateurs.

      console.log(`${name} as joined.`);
      socket.broadcast.emit("server", `${name} a rejoint le salon.`);
      socket.emit("server", "Bienvenue!");
    }

  });

  socket.on("new-message", data => {
    if ( data  != "") {
      const txt = `${users[socket.id]} :  ${data}`  // Si on ne peux pas concagener c'est que le script a été modifié.
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
