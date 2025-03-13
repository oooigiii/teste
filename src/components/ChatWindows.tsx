import React, { useState } from 'react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
}

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (content: string) => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4">
        <h2>Chat Window</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`my-2 p-2 rounded-lg ${
              message.sender === 'me'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 mr-auto'
            }`}
          >
            <p>{message.content}</p>
            <small>{message.timestamp.toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
