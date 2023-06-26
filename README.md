# ChatRoom

Projeto desenvolvido utilizando a tecnologia Chat-GPT

Este é um componente React que implementa uma sala de chat usando WebSockets e a biblioteca `stompjs` para se comunicar com um servidor de chat.

## Dependências

Certifique-se de ter as seguintes dependências instaladas no seu projeto React:

- `react`
- `stompjs`
- `sockjs-client`

## Uso

1. Importe as dependências necessárias:

```jsx
import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
```

2. Crie uma instância do cliente WebSocket e defina o estado inicial do componente:

```jsx
var stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    
    // Resto do código...
};
```

3. Defina a função `connect()` para estabelecer a conexão com o servidor de chat:

```jsx
const connect = () => {
    // let Sock = new SockJS('https://spring-chat-backend-production.up.railway.app/ws'); // para deploy
    let Sock = new SockJS('http://localhost:8080/ws'); // para testes locais
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
};
```

4. Implemente as funções de callback para manipular eventos de conexão, mensagens recebidas e erros:

```jsx
const onConnected = () => {
    setUserData({ ...userData, "connected": true });
    stompClient.subscribe('/chatroom/public', onMessageReceived);
    stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
    userJoin();
};

const userJoin = () => {
    var chatMessage = {
        senderName: userData.username,
        status: "JOIN"
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
};

const onMessageReceived = (payload) => {
    // Resto da implementação...
};

const onPrivateMessage = (payload) => {
    // Resto da implementação...
};

const onError = (err) => {
    console.log(err);
};
```

5. Implemente as funções para lidar com o envio de mensagens:

```jsx
const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, "message": value });
};

const sendValue = () => {
    // Resto da implementação...
};

const sendPrivateValue = () => {
    // Resto da implementação...
};

const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, "username": value });
};

const registerUser = () => {
    connect();
};

const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        if (tab === "CHATROOM") {
            sendValue();
        } else {
            sendPrivateValue();
        }
    }
};
```

6. Renderize o componente de acordo com o estado atual:

```jsx
return (
    <div className="container">
        {userData.connected ?
            // Exibição da sala de chat quando conectado
            <div className="

chat-box">
                {/* Resto da implementação... */}
            </div>
            :
            // Exibição do formulário de registro quando desconectado
            <div className="register">
                {/* Resto da implementação... */}
            </div>
        }
    </div>
);
```

7. Exporte o componente para uso em outros arquivos:

```jsx
export default ChatRoom;
```