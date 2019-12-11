const socket = io("http://localhost:3000");

// conteneur des messages envoyé par l'utilisateur
const msgForm = document.getElementById("input-container");
// conteneur des messages
const msgCont = document.getElementById("message-container");
// Message du serveur.
const servCont = document.getElementById("server");

// Les entré utilisateur.
const msgInput = document.getElementById("input");

// Nom du client.
const name = createName();
socket.emit("new-user", name);  // On envoie le nom au serveur.


function createName()  {
  const name = prompt("Votre pseudonyme:");
  if ( ! name ) { name = Math.random() }
  return name;
}




function addMessage(msg, color = "#DDDDDD") {
  /* Fonction pour creer un nouvelle element contenant un message */
  const newContainer = document.createElement('div'); // creation d'un element html
  newContainer.style.color = color;
  newContainer.innerText = msg;  // ajout du message dans l'element.
  return newContainer;  // ajout de l'element a la page.
}

socket.on("server", txt => {
  var cont = addMessage(txt);
  servCont.append(cont);
});

socket.on("chat-message", txt =>  {
  msgCont.append(addMessage(txt));
})

socket.on("your-message", txt => {
  msgCont.append(addMessage(txt, "#34eefa"));
})

msgForm.addEventListener("submit", e =>  {
  // Arrette le raffraichissement de la page lors des envoies de texte.
  e.preventDefault();

  const msg = msgInput.value;  // contenue de la zone de saisie
  // Envoie le message du client jusqu'au serveur.
  socket.emit("new-message", // Creer l'event "new-message" et l'envoie au serveur
    {user: name, txt: msg});
  // Puis on vide le contenu de la zone de saisie.
  msgInput.value = "";
})
