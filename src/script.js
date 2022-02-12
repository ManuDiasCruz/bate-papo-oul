function login(nome){
    const usuario = {
        usuario: nome
    };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
    promise.then(imprimirMsg);   
}

buscarMensagens();

function iniciarChat(){

}

function buscarMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(imprimirMsg);
}

function imprimirMsg(msg){
    console.log(msg.data);

}

function enviarMsg(){}

function manterConcexao(){}
