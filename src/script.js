// Variable initiation
let messages = [];
let filteredMsgs = [];

let messageType = "";


let today = new Date();
let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let lastTimeMsg = "";

let msg = {
    from: "",
    to: "Todos",
    text: "entra na sala",
    type: "status",
    time: currentTime
};

let usuario = {
    name: ""
};

// Function area
function getData(answerServidor) {
    messages = [];
    console.log("Entrei em getData()");
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
    setTimeout(userMsgs.forEach(screenRenderMessage), 50);
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
    chat.scrollIntoView();
}

function showAllMessages(msgList) {
    for(let i=0; i<msgList.length; i++){
        screenRenderMessage(msgList[i]);
    }
}

function loadingLogin(){
    console.log("Loading...")
    document.querySelector(".carregando").style.display = "flex";
    setTimeout(login(), 100000);
}

function login(){    
    usuario.name = document.querySelector(".login").querySelector("input").value;
    console.log(usuario);
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
    promise.then(loginOk);
    promise.catch(loginError);

    let pMsg = setInterval(getMessages, 3000);
    let pUser = setInterval(pingUser, 5000);
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
    console.log("Ping messages");
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
}

function pingUser(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", usuario);
    console.log("Pin servidor");
    usuario.name = "";
    promise.catch(messageError);
}

document.addEventListener("keypress", function(element) {
    if(element.key === 'Enter') {
        var button = document.querySelector("#submit");
        button.sendMessage();
    }
});

function sendMessage(){
    console.log("Cliquei para enviar msg!");
    msg = createMessage();
    console.log(msg);
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", msg);
    promise.catch(messageError);
}

function messageError(){
    alert("Seu usuário foi desconectado!");
    document.location.reload(true);
}

function createMessage(){
    let texto = document.querySelector("input").value;
    console.log(texto + lastTimeMsg);
    msg = {
        from: usuario.name,
        to: "Todos",
        text: texto,
        type: "message",
        time: lastTimeMsg
    };
    return msg;
}