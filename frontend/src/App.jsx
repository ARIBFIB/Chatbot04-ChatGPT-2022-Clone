import { useState, useEffect } from 'react';
import './App.css';
import './Normal.css';
import { AiOutlinePlus } from "react-icons/ai";

function App() {
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [chatlog, setChatlog] = useState([
    { user: "me", message: "hi" },
    { user: "gpt", message: "How can I help you today?" },
  ]);

  useEffect(() => {
    getEngines();
  }, [])

  function clearChat(){
    setChatlog([])
  }

  function getEngines(){
    fetch("http://localhost:3080/models")
    .then(res=>res.json())
    .then(data=>setModels(data.models))
    .catch(error => console.error('Error fetching models', error));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Add user's message to the chat log
    const updatedChatlog = [...chatlog, { user: "me", message: input }];
    setChatlog(updatedChatlog);
    setInput("");
  
    try {
      const response = await fetch("http://localhost:3080", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }), // here we send the selected Model
      });
      const data = await response.json();
  
      // Add the server's response to the chat log
      setChatlog([...updatedChatlog, { user: "gpt", message: data.message }]);
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    }
  };
  

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>
            <AiOutlinePlus />
          </span>
          New Chat
        </div>
        <div className='models'>
          GPT Model
          <select>
          {models.map((model, index) => (
              //display model id or model name
              <option key={index} value={model.id}>
                {model.id} 
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              className="chat-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className="chat-message-center">
      <div className={`avatar ${message.user === "gpt" ? "chatgpt" : "user"}`}>
        {message.user === "gpt" && <span>GPT</span>}
        {message.user === "me" && <span>Me</span>}
      </div>
      <div className="message">{message.message}</div>
    </div>
  );
};


export default App;