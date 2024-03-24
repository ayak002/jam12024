import React, { useState, useEffect } from 'react';

const ChatApp = (socket) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.socket.on('answer', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
    };
  }, []);

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.socket.emit('sendmessage', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div>
      <h1>Chat en direct</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={handleMessageInputChange}
        placeholder="Entrez votre message..."
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default ChatApp;
