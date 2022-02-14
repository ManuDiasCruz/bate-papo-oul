// Variable initiation
let messages = [];
let participants = [];
let messageType = "";

let msg = {
    from: "",
    to: "Todos",
    text: "entra na sala",
    type: "status",
    time: "00:00:00"
};

let usuario = {
    name: ""
};

let receiver = "Todos";
let msgType = "message";

// Function area
function getData(answerServidor) {
    messages = [];
    for (let i=0; i<answerServidor.data.length; i++){
        messages.push(answerServidor.data[i]);
    }
    filterUserMsgs();

    // Makes the last message scroll up
    const lastMsg = document.querySelector("main").lastElementChild;
    lastMsg.scrollIntoView();
    lastTimeMsg = lastMsg.querySelector(".time").innerHTML;
}

function filterUserMsgs(){
    const userMsgs = messages.filter(filterMsg);
    userMsgs.forEach(screenRenderMessage);
}

// Falta verificar se as msgs são de depois que o usuário entrou
function filterMsg(msg){
    if (msg.from === usuario.name || msg.to === usuario.name || msg.to === "Todos"){
        return true;
    }else{
        return false;
    }
}

function screenRenderMessage(msg) {
    const chat = document.querySelector("main");
    if (usuario.name == msg.from){
        if (msg.type === "message"){
            chat.innerHTML += `
            <div data-identifier="message" class="message normal">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">Você </span> para <span class="nome-usuario">${msg.to}</span>: ${msg.text}</p>
            </div>`;
        }else if (msg.type == "status"){
            chat.innerHTML += `
            <div data-identifier="message" class="message status">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">Você </span> ${msg.text}</p>
            </div>`;
        }else if (msg.type == "private_message"){
            chat.innerHTML += `
            <div class="message reserved">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">Você </span> reservadamente para <span class="nome-usuario">${msg.to}</span>: ${msg.text}</p>
            </div>`;
        }
    }else if (usuario.name == msg.to){
        if (msg.type === "message"){
            chat.innerHTML += `
            <div data-identifier="message" class="message normal">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> para <span class="nome-usuario">Você</span>: ${msg.text}</p>
            </div>`;
        }else if (msg.type == "status"){
            chat.innerHTML += `
            <div data-identifier="message" class="message status">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> ${msg.text}</p>
            </div>`;
        }else if (msg.type == "private_message"){
            chat.innerHTML += `
            <div class="message reserved">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> reservadamente para <span class="nome-usuario">Você</span>: ${msg.text}</p>
            </div>`;
        }
    }else{
        if (msg.type === "message"){
            chat.innerHTML += `
            <div data-identifier="message" class="message normal">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> para <span class="nome-usuario">${msg.to}</span>: ${msg.text}</p>
            </div>`;
        }else if (msg.type == "status"){
            chat.innerHTML += `
            <div data-identifier="message" class="message status">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> ${msg.text}</p>
            </div>`;
        }else if (msg.type == "private_message"){
            chat.innerHTML += `
            <div class="message reserved">
                <p class="time">${msg.time}</p>
                <p> <span class="nome-usuario">${msg.from} </span> reservadamente para <span class="nome-usuario">${msg.to}</span>: ${msg.text}</p>
            </div>`;
        }
    }
}

function showAllMessages(msgList) {
    for(let i=0; i<msgList.length; i++){
        screenRenderMessage(msgList[i]);
    }
}

function loadingLogin(){
    document.querySelector(".carregando").style.display = "flex";
    setTimeout(login(), 3000);
}

function login(){    
    usuario.name = document.querySelector(".login").querySelector("input").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
    promise.then(loginOk);
    promise.catch(loginError);

    getMessages();
    getParticipants();
    pingUser();

    setInterval(getMessages, 3000);
    setInterval(pingUser, 5000);
    setInterval(getParticipants, 10000);
}

function loginOk(){
    document.querySelector(".login").style.display = "none";
    document.querySelector(".carregando").style.display = "none";
}

function loginError(error){
    alert(error);
    usuario.nome = null;
    document.querySelector(".carregando").style.display = "none";
    document.querySelector(".login").querySelector("input").value = "Digite seu nome";
    document.querySelector(".login-error").innerHTML = "Nome de usuário já em uso, por favor digite um novo nome.";
}

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(getData);
}

function openSidebar(){
    document.querySelector(".background").style.display = "block";
    document.querySelector("aside").style.display = "flex";
}

function closeSidebar(){
    document.querySelector(".background").style.display = "none";
    document.querySelector("aside").style.display = "none";
    const auxText = document.querySelector(".enter-message");
    if (msgType == "private_message"){
        auxText.querySelector("p").innerHTML = `Enviando para ${receiver} (reservadamente)`;
    }else{
        auxText.querySelector("p").innerHTML = `Enviando para ${receiver}`;
    }
    
}

function getParticipants(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promise.then(getParticipantsData);
}

function getParticipantsData(answerServidor) {
    participants = [];
    for (let i=0; i<answerServidor.data.length; i++){
        participants.push(answerServidor.data[i]);
    }
    participants.forEach(screenRenderParticipant);
}


function screenRenderParticipant(participant){
    const userList = document.querySelector(".contact-list");
    userList.innerHTML += `
    <article data-identifier="participant" class="contacts" onclick="putCheckmark(this)">
        <div class="contact">
            <ion-icon class="icone" name="person-circle-outline"></ion-icon>
            <p>${participant.name}</p>
        </div>
        <div class="selected">
            <img src="res/Vector.svg" alt="">
        </div>
    </article>`;
}

function putCheckmark(element){
    const allUsers = document.querySelectorAll(".selected");
    for (let i=0; i<allUsers.length; i++){
        allUsers[i].style.display = "none";
    }    
    receiver = element.querySelector("p").innerHTML;
    element.querySelector(".selected").style.display = "block";
}

function messageVisibility(element){
    if (element.querySelector("p").innerHTML === "Público"){
        document.querySelector(".private-message").style.display = "none";
        element.querySelector(".public-message").style.display = "block";
        msgType = "message";
    }else {
        document.querySelector(".public-message").style.display = "none";
        element.querySelector(".private-message").style.display = "block";
        msgType = "private_message";
    }
}

function pingUser(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", usuario);
    promise.catch(messageError);
}

document.addEventListener("keypress", function(element) {
    if(element.key === 'Enter') {
        var button = document.querySelector("#submit");
        button.sendMessage();
    }
});

function sendMessage(){
    msg = createMessage();
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", msg);
    promise.catch(messageError);
}

function messageError(){
    alert("Seu usuário foi desconectado!");
    document.location.reload(true);
}

function createMessage(){
    let texto = document.querySelector("input").value;
    msg = {
        from: usuario.name,
        to: receiver,
        text: texto,
        type: msgType,
        time: lastTimeMsg
    };
    return msg;
}