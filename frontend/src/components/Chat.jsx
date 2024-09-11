import React, { useState } from 'react';
import Message from './Message';
import axios from 'axios';

const Chat = () => {
  const [chatValue, setChatValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!chatValue.trim()) return;

    const newMessage = { text: chatValue, sender: 'user' };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', {
        message: chatValue,
      });

      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setChatValue('');
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={chatValue}
          onChange={(e) => setChatValue(e.target.value)}
          placeholder="Send a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;