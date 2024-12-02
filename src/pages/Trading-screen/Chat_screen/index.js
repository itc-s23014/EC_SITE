import { useState } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;
        const newMessage = { id: Date.now(), text: input };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');
    };

    return (
        <div style={{ border: '1px solid #000', padding: '8px' }}>
            <h3>Chat</h3>
            <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '8px' }}>
                {messages.map((message) => (
                    <div key={message.id} style={{ margin: '4px 0' }}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, marginRight: '8px', padding: '4px' }}
                />
                <button onClick={sendMessage}>送信</button>
            </div>
        </div>
    );
}
