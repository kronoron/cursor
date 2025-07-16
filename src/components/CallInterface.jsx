import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import './CallInterface.css'

const CallInterface = ({ scenario, onEnd }) => {
  const [callState, setCallState] = useState('connecting') // connecting, active, ended
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callLog, setCallLog] = useState([])
  const { user } = useUser()

  useEffect(() => {
    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallState('active')
      setCallLog(prev => [...prev, {
        timestamp: new Date(),
        event: 'Call connected',
        speaker: 'system'
      }])
      
      // Start with AI greeting after connection
      setTimeout(() => {
        setCallLog(prev => [...prev, {
          timestamp: new Date(),
          event: getAiGreeting(scenario),
          speaker: 'ai'
        }])
      }, 1000)
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [scenario])

  useEffect(() => {
    let interval
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  const getAiGreeting = (scenario) => {
    const greetings = {
      1: "Hello, this is Sarah Johnson from TechCorp. Thanks for taking my call. I wanted to discuss your recent proposal...",
      2: "Hi there! Mike Chen here from StartupXYZ. I appreciate you making time to speak with me today...",
      3: "Good morning! Jennifer Adams speaking. I got your email and wanted to chat about what you mentioned...",
      4: "Good afternoon, this is Robert Kim. I'm calling on behalf of Mr. Thompson regarding your request...",
      5: "Hi! Alex Rodriguez here. Thanks for reaching out. I'm excited to learn more about your solutions...",
      6: "Hello, this is Lisa Zhang from Finance. I wanted to discuss our renewal situation with you...",
      7: "Hey! David Wilson here. Great to connect with you. I wanted to talk about our account..."
    }
    
    return greetings[scenario.id] || "Hello! Thanks for calling. I'm looking forward to our conversation."
  }

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    setCallLog(prev => [...prev, {
      timestamp: new Date(),
      event: isMuted ? 'Microphone unmuted' : 'Microphone muted',
      speaker: 'system'
    }])
  }

  const handleRecord = () => {
    setIsRecording(!isRecording)
    setCallLog(prev => [...prev, {
      timestamp: new Date(),
      event: isRecording ? 'Recording stopped' : 'Recording started',
      speaker: 'system'
    }])
  }

  const endCall = () => {
    setCallState('ended')
    setCallLog(prev => [...prev, {
      timestamp: new Date(),
      event: 'Call ended',
      speaker: 'system'
    }])
    
    setTimeout(() => {
      onEnd()
    }, 2000)
  }

  const simulateUserSpeaking = () => {
    setCallLog(prev => [...prev, {
      timestamp: new Date(),
      event: '[User speaking...]',
      speaker: 'user'
    }])
    
    // Simulate AI response after user speaks
    setTimeout(() => {
      const responses = [
        "I understand what you're saying. Let me address that concern...",
        "That's a great point. Have you considered the long-term benefits?",
        "I see. Can you tell me more about your specific requirements?",
        "Absolutely. Let me explain how we can help with that...",
        "Good question. Here's how we typically handle that situation...",
        "I appreciate your transparency. What would be the ideal solution for you?"
      ]
      
      const response = responses[Math.floor(Math.random() * responses.length)]
      setCallLog(prev => [...prev, {
        timestamp: new Date(),
        event: response,
        speaker: 'ai'
      }])
    }, 2000 + Math.random() * 3000)
  }

  if (callState === 'ended') {
    return (
      <div className="call-interface ended">
        <div className="call-ended-screen">
          <div className="call-ended-icon">📞</div>
          <h2>Call Ended</h2>
          <p>Duration: {formatCallDuration(callDuration)}</p>
          <p>Scenario: {scenario.title}</p>
          <button onClick={onEnd} className="return-btn">Return to Training</button>
        </div>
      </div>
    )
  }

  return (
    <div className="call-interface">
      <div className="call-header">
        <div className="scenario-info">
          <h2>{scenario.title}</h2>
          <p><strong>Customer:</strong> {scenario.customerProfile}</p>
          <div className="call-status">
            <span className={`status-indicator ${callState}`}></span>
            <span className="status-text">
              {callState === 'connecting' ? 'Connecting...' : 'Call Active'}
            </span>
          </div>
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

      <div className="call-screen">
        <div className="caller-info">
          <div className="avatar">
            {scenario.customerProfile.split(' ')[0][0]}
          </div>
          <h3>{scenario.customerProfile.split(',')[0]}</h3>
          <p>{scenario.customerProfile.split(',')[1]}</p>
          <div className="call-timer">{formatCallDuration(callDuration)}</div>
        </div>

        {callState === 'connecting' && (
          <div className="connecting-animation">
            <div className="pulse"></div>
            <div className="pulse"></div>
            <div className="pulse"></div>
          </div>
        )}

        {callState === 'active' && (
          <div className="call-controls">
            <button 
              className={`control-btn mute ${isMuted ? 'active' : ''}`}
              onClick={handleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            
            <button 
              className="control-btn speak"
              onClick={simulateUserSpeaking}
              title="Simulate Speaking"
              disabled={isMuted}
            >
              💬
            </button>
            
            <button 
              className={`control-btn record ${isRecording ? 'active' : ''}`}
              onClick={handleRecord}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? '⏹️' : '⏺️'}
            </button>
            
            <button 
              className="control-btn end-call"
              onClick={endCall}
              title="End Call"
            >
              📞
            </button>
          </div>
        )}
      </div>

      <div className="call-log">
        <h4>Call Activity</h4>
        <div className="log-entries">
          {callLog.map((entry, index) => (
            <div key={index} className={`log-entry ${entry.speaker}`}>
              <span className="log-time">
                {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="log-content">{entry.event}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="call-notes">
        <p><strong>Note:</strong> This is a simulated call environment. In the full version, 
        actual voice API integration will enable real voice conversations with AI customers.</p>
        <p>Click the 💬 button to simulate speaking and trigger AI responses.</p>
      </div>
    </div>
  )
}

export default CallInterface