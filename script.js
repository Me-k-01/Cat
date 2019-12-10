const socket = io("http://localhost:3000")

// conteneur des message envoyé par l'utilisateur
const msgForm = document.getElementById("send-container")
// conteneur des messages recus
const msgCont = document.getElementById("message-container")
// Les entré utilisateur.
const msgInput = document.getElementById("message-input")

// Nom du client.
const userName = prompt("Votre pseudonyme:")
const userId = Math.trunc(Math.random() * 1000)
const user = userName + " #" + userId.toString(16).toUpperCase()

function addMessage(msg) {
  /* Fonction pour ajouter un nouveau messae a la page web. */
  const newContainer = document.createElement('div') // creation d'un element html
  newContainer.innerText = msg  // ajout du message dans l'element.
  msgCont.append(newContainer)  // ajout de l'element a la page.
}

socket.on("chat-message", txt => {


  console.log(txt);
  addMessage(txt);
})

msgForm.addEventListener("submit", e =>  {
  // Arrette le raffrechissement de la page lors des envoies de texte.
  e.preventDefault()
  const msg = msgInput.value  // contenue de la zone de saisie
  // Envoie le message du client jusqu'au serveur.
  socket.emit("new-message", // Creer l'event "new-message"
    {user: user, txt: msg})
  // Puis on vide le contenu de la zone de saisie.
  msgInput.value = "";
})
