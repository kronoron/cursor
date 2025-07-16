import { useState, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import './ChatInterface.css'

const ChatInterface = ({ scenario, onEnd }) => {
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useUser()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!sessionStarted) {
      // Start the conversation with AI opening
      const aiOpening = getAiOpening(scenario, user.role)
      setTimeout(() => {
        setMessages([{
          id: 1,
          sender: 'ai',
          content: aiOpening,
          timestamp: new Date()
        }])
        setSessionStarted(true)
      }, 1000)
    }
  }, [scenario, user.role, sessionStarted])

  const getAiOpening = (scenario, userRole) => {
    const openings = {
      1: "Hi there! I'm Sarah from TechCorp. I've been reviewing your proposal and I have to say, the pricing seems quite steep for our current budget. We've been comparing with other vendors and they're offering similar solutions at 30% less. Can you help me understand what justifies this price point?",
      2: "Hello! Mike here from StartupXYZ. I've been looking at your platform, but I'm also evaluating [Competitor]. Their demo was pretty impressive and they claim to have better integration capabilities. Why should I choose your solution over theirs?",
      3: "Thanks for following up on your email. I saw what you sent about improving our marketing efficiency. To be honest, we're pretty swamped right now and I'm not sure we have bandwidth for any new initiatives. What exactly are you proposing?",
      4: "Good morning, this is Robert, executive assistant to Mr. Thompson. He's in back-to-back meetings all week and his schedule is completely full. What is this regarding exactly, and why does it need to be Mr. Thompson specifically?",
      5: "Hi! I submitted a form on your website yesterday asking about your solutions. We're growing fast and our current processes are becoming a bottleneck. I'd like to learn more about how you can help us scale our operations.",
      6: "Hi, this is Lisa from Finance. I need to discuss our upcoming renewal with you. Honestly, we're facing significant budget cuts this quarter and I'm having trouble justifying the current contract amount to leadership. Can we talk about options?",
      7: "Hey there! Things have been going really well with your platform. Our team has grown by 40% this quarter and we're starting to hit some limits with our current plan. I wanted to see what expansion options you might have available."
    }
    
    return openings[scenario.id] || "Hello! Thanks for reaching out. I'm interested in learning more about what you have to offer."
  }

  const generateAiResponse = (userMessage, conversation) => {
    // This is a mock AI response generator
    // In a real implementation, this would call an AI API
    const responses = [
      "That's a great question. Let me think about that for a moment...",
      "I see your point. Can you tell me more about your specific requirements?",
      "Interesting perspective. How does that align with your current goals?",
      "I understand your concerns. What would be the ideal outcome for you?",
      "That makes sense. Have you considered how this might impact your team?",
      "Good point. What's your timeline for making a decision on this?",
      "I appreciate you sharing that. What's driving this priority for your organization?",
      "Thanks for clarifying. What would success look like from your perspective?"
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsAiTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: generateAiResponse(currentMessage, messages),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsAiTyping(false)
    }, 1500 + Math.random() * 2000) // Random delay between 1.5-3.5 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const endSession = () => {
    // In a real app, this would save the session data
    onEnd()
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="scenario-info">
          <h2>{scenario.title}</h2>
          <p><strong>Customer:</strong> {scenario.customerProfile}</p>
          <p><strong>Difficulty:</strong> <span className={`difficulty ${scenario.difficulty.toLowerCase()}`}>{scenario.difficulty}</span></p>
        </div>
        <div className="chat-actions">
          <button className="end-session-btn" onClick={endSession}>
            End Session
          </button>
        </div>
      </div>

      <div className="objectives-bar">
        <strong>Objectives:</strong>
        <div className="objectives-list">
          {scenario.objectives.map((objective, index) => (
            <span key={index} className="objective-tag">{objective}</span>
          ))}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-header">
              <span className="sender-name">
                {message.sender === 'ai' ? scenario.customerProfile.split(',')[0] : user.name}
              </span>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        
        {isAiTyping && (
          <div className="message ai typing">
            <div className="message-header">
              <span className="sender-name">{scenario.customerProfile.split(',')[0]}</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            rows="3"
            disabled={isAiTyping}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isAiTyping}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface