// Variable initiation
let messages = [];
let filteredMsgs = [];


let today = new Date();
let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

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

// getMessages();

 
function getData(answerServidor) {
    console.log("Entrei em getData()");
    for (let i=0; i<answerServidor.data.length; i++){
        messages.push(answerServidor.data[i]);
    }
    showAllMessages(messages);
    // filterUserMsgs();

    // Makes the last message scroll up
    const lastMsg = document.querySelector("main").lastElementChild;
    lastMsg.scrollIntoView();
    let lastTimeMsg = lastMsg.querySelector(".time").innerHTML;
}

function showAllMessages(msgList) {
    for(let i=0; i<msgList.length; i++){
        screenRenderMessage(msgList[i]);
    }
}

function filterUserMsgs(){
    const userMsgs = messages.filter(filterMsg);
    userMsgs.forEach(screenRenderMessage);
}

function filterMsg(msg){
    if (msg.from === usuario.nome || msg.to === usuario.nome || msg.to === "Todos"){
        return true;
    }else{
        return false;
    }
}

function screenRenderMessage(msg) {
    const chat = document.querySelector("main");
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
    chat.scrollIntoView();
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
}

function loginOk(){
    document.querySelector(".login").style.display = "none";
    document.querySelector(".carregando").style.display = "none";
    getMessages();
}

function loginError(error){
    alert("Status error code: " + error);
    usuario.nome = null;
    document.querySelector(".carregando").style.display = "none";
    document.querySelector(".login").querySelector("input").value = "Digite seu nome";
}

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(getData);
    console.log("Voltei do then!");
}

// setInterval(pingMsg, 5000);

function pingMsg(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
    console.log("Pin servidor");
    promise.catch(loginError);
}
