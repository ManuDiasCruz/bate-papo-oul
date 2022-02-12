let messages = [];
let filteredMsgs = [];

let msg = {
    from: "Manu",
    to: "Todos",
    text: "Boa noite!",
    type: "message",
    time: "01:10:44"
};

let usuario = {
    from: "teste",
    to: "Todos",
    text: "Boa noite!",
    type: "message",
    time: "01:10:44"
};

getMessages();
setInterval(getMessages, 3000);

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(getData);
    console.log("Voltei do then!");
    const ultimaMensagem = document.querySelector("main").lastElementChild;
    ultimaMensagem.scrollIntoView();
}
  
function getData(answerServidor) {
    console.log("Entrei em getData()");
    for (let i=0; i<answerServidor.data.length; i++){
        messages.push(answerServidor.data[i]);
    }
    // showAllMessages(messages);
    filterUserMsgs();
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
    if (msg.from === usuario.from || msg.to === usuario.from){
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

function login(nome){
    const usuario = {
        usuario: nome
    };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
    promise.then(imprimirMsg);   
}

function enviarMsg(){}
