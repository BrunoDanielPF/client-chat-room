import React from 'react';

const ChatBox = ({
  privateChats,
  publicChats,
  tab,
  userData,
  setTab,
  handleMessage,
  sendValue,
  sendPrivateValue,
  handleKeyDown
}) => {
  return (
    <div className="chat-box">
      <div className="member-list">
        {/* Componente para exibir a lista de membros */}
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

      {tab === "CHATROOM" && (
        <div className="chat-content">
          <ul className="chat-messages">
            {/* Componente para exibir as mensagens da sala de chat pública */}
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
        </div>
      )}

      {tab !== "CHATROOM" && (
        <div className="chat-content">
          <ul className="chat-messages">
            {/* Componente para exibir as mensagens da conversa privada */}
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
        </div>
      )}
    </div>
  );
};

export default ChatBox;
