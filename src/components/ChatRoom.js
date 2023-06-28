import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import ChatBox from './ChatBox';
import RegisterForm from './RegisterForm';
import MessageModal from './MessageModal';

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
          {userData.connected ? (
            <ChatBox
              privateChats={privateChats}
              publicChats={publicChats}
              tab={tab}
              userData={userData}
              setTab={setTab}
              handleMessage={handleMessage}
              sendValue={sendValue}
              sendPrivateValue={sendPrivateValue}
              handleKeyDown={handleKeyDown}
            />
          ) : (
            <RegisterForm
              userData={userData}
              setUserData={setUserData}
              registerUser={registerUser}
              handleUsername={handleUsername}
            />
          )}
    
          {isEmptyMessage && (
            <MessageModal closeModal={closeModal} />
          )}
        </div>
      );
    };
    
    export default ChatRoom;