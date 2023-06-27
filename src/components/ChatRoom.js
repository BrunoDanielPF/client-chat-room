import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

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
    const [isEmptyMessage, setIsEmptyMessage] = useState(false);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('https://spring-chat-backend-production.up.railway.app/ws'); // para deploy
        // let Sock = new SockJS('http://localhost:8080/ws'); // para testes locais
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

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
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    };

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    };

    const sendValue = () => {
        if (stompClient) {
            if (userData.message.trim() === '') {
                setIsEmptyMessage(true);
                return;
            }

            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setIsEmptyMessage(false);
        }
    };

    const sendPrivateValue = () => {
        if (stompClient) {
            if (userData.message.trim() === '') {
                setIsEmptyMessage(true);
                return;
            }

            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
            setIsEmptyMessage(false);
        }
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

    useEffect(() => {
        if (isEmptyMessage) {
            const timer = setTimeout(() => {
                setIsEmptyMessage(false);
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isEmptyMessage]);

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${tab === "CHATROOM" && "active"}`}
                                    onClick={() => { setTab("CHATROOM") }}
                                >
                                    Sala de chat
                                </button>
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li className="nav-item" key={index}>
                                    <button
                                        className={`nav-link ${tab === name && "active"}`}
                                        onClick={() => { setTab(name) }}
                                    >
                                        {name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message-chat">
                            <input type="text" className="input-message" placeholder="Digite a mensagem" value={userData.message} onChange={handleMessage} onKeyDown={handleKeyDown} />
                            <button type="button" className="btn btn-primary send-button" onClick={sendValue}>Enviar</button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message-chat">
                            <input type="text" className="input-message" placeholder="Digite a mensagem" value={userData.message} onChange={handleMessage} onKeyDown={handleKeyDown} />
                            <button type="button" className="btn btn-primary send-button" onClick={sendPrivateValue}>Enviar</button>
                        </div>
                    </div>}
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Digite seu nome"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        className="form-control"
                    />
                    <button type="button" className="btn btn-primary" onClick={registerUser}>
                        Conectar
                    </button>
                </div>}
            {isEmptyMessage && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">O campo de mensagem está vazio.</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
