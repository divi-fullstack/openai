import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.toLowerCase() === "yes" || input.toLowerCase() === "no") {
      socket.emit('continue', input);
    } else {
      socket.emit('choose', input);
    }
    setInput('');
  };

  return (
    <div>
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.message}</p>
            {msg.options && <p>Options: {msg.options.join(', ')}</p>}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoComplete="off"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
