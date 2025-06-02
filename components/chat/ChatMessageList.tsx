import React from 'react';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message-wrapper ${message.isOwn ? 'own' : 'other'}`}>
          {!message.isOwn && (
            <img 
              src={message.avatar} 
              alt={message.sender} 
              className="message-avatar"
            />
          )}
          <div className={`message-bubble ${message.isOwn ? 'own' : 'other'}`}>
            {!message.isOwn && (
              <div className="message-sender">{message.sender}</div>
            )}
            <div className="message-content">{message.message}</div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;
