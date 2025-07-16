import { useState } from 'react'
import { useUser } from '../context/UserContext'
import ChatInterface from './ChatInterface'
import CallInterface from './CallInterface'
import './TrainingModule.css'

const TrainingModule = () => {
  const [activeMode, setActiveMode] = useState(null) // null, 'message', 'call'
  const [currentScenario, setCurrentScenario] = useState(null)
  const { user } = useUser()

  // Mock scenarios based on user role
  const getScenarioByRole = (role) => {
    const scenarios = {
      'AE': [
        {
          id: 1,
          title: 'Enterprise Deal Negotiation',
          description: 'Handle a complex enterprise client asking for significant discounts',
          customerProfile: 'Sarah Johnson, VP of Operations at TechCorp',
          difficulty: 'Advanced',
          objectives: ['Maintain pricing integrity', 'Find value-based solutions', 'Close the deal']
        },
        {
          id: 2,
          title: 'Competitive Displacement',
          description: 'Customer is comparing with a major competitor',
          customerProfile: 'Mike Chen, CTO at StartupXYZ',
          difficulty: 'Intermediate',
          objectives: ['Highlight unique value props', 'Address competitor concerns', 'Schedule follow-up']
        }
      ],
      'SDR': [
        {
          id: 3,
          title: 'Cold Outreach Follow-up',
          description: 'Following up on a cold email that got a lukewarm response',
          customerProfile: 'Jennifer Adams, Marketing Director',
          difficulty: 'Beginner',
          objectives: ['Build rapport', 'Qualify the lead', 'Book a meeting']
        },
        {
          id: 4,
          title: 'Gatekeeper Bypass',
          description: 'Getting past the executive assistant to reach decision maker',
          customerProfile: 'Robert Kim, Executive Assistant to CEO',
          difficulty: 'Intermediate',
          objectives: ['Build rapport with gatekeeper', 'Demonstrate value', 'Get CEO meeting']
        }
      ],
      'BDR': [
        {
          id: 5,
          title: 'Inbound Lead Qualification',
          description: 'Qualifying a high-value inbound lead from website form',
          customerProfile: 'Alex Rodriguez, Operations Manager',
          difficulty: 'Beginner',
          objectives: ['Understand pain points', 'Qualify budget and timeline', 'Set AE meeting']
        }
      ],
      'CSM': [
        {
          id: 6,
          title: 'Renewal Risk Management',
          description: 'Customer expressing concerns about renewal due to budget cuts',
          customerProfile: 'Lisa Zhang, Finance Director',
          difficulty: 'Advanced',
          objectives: ['Understand budget constraints', 'Demonstrate ROI', 'Secure renewal']
        }
      ],
      'AM': [
        {
          id: 7,
          title: 'Upsell Opportunity',
          description: 'Existing customer shows signs of growth, perfect for upselling',
          customerProfile: 'David Wilson, Head of Sales',
          difficulty: 'Intermediate',
          objectives: ['Identify expansion needs', 'Present upgrade options', 'Close upsell']
        }
      ]
    }
    
    return scenarios[role] || scenarios['SDR']
  }

  const startTraining = (mode) => {
    const scenarios = getScenarioByRole(user.role)
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    setCurrentScenario(randomScenario)
    setActiveMode(mode)
  }

  const endTraining = () => {
    setActiveMode(null)
    setCurrentScenario(null)
  }

  if (activeMode === 'message' && currentScenario) {
    return <ChatInterface scenario={currentScenario} onEnd={endTraining} />
  }

  if (activeMode === 'call' && currentScenario) {
    return <CallInterface scenario={currentScenario} onEnd={endTraining} />
  }

  return (
    <div className="training-module">
      <div className="training-header">
        <h1>AI Training Simulation</h1>
        <p>Role: <span className="user-role">{user.role}</span> | Access: <span className="access-level">{user.accessLevel}</span></p>
      </div>

      <div className="training-description">
        <h2>Welcome to CxSE Training</h2>
        <p>
          Practice your sales skills with AI-powered customer simulations tailored to your role as an {user.role}.
          Choose your preferred training method below to get started.
        </p>
      </div>

      <div className="training-options">
        <div className="training-card" onClick={() => startTraining('message')}>
          <div className="card-icon">💬</div>
          <h3>Message Training</h3>
          <p>Practice your written communication skills through text-based conversations with AI customers.</p>
          <div className="card-features">
            <span className="feature">• Real-time AI responses</span>
            <span className="feature">• Role-specific scenarios</span>
            <span className="feature">• Instant feedback</span>
          </div>
          <button className="start-btn">Start Message Training</button>
        </div>

        <div className="training-card" onClick={() => startTraining('call')}>
          <div className="card-icon">📞</div>
          <h3>Call Training</h3>
          <p>Enhance your verbal communication and phone skills with voice-based AI customer interactions.</p>
          <div className="card-features">
            <span className="feature">• Voice conversation</span>
            <span className="feature">• Natural dialogue flow</span>
            <span className="feature">• Speaking confidence</span>
          </div>
          <button className="start-btn">Start Call Training</button>
        </div>
      </div>

      <div className="training-stats">
        <h3>Your Training Progress</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Sessions Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Scenarios Practiced</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">-</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
      </div>

      {user.accessLevel === 'Owner' && (
        <div className="owner-section">
          <h3>Owner Features</h3>
          <button className="upload-btn">📁 Upload Company Data</button>
          <p className="owner-note">Upload your company's sales data to generate more personalized training scenarios.</p>
        </div>
      )}
    </div>
  )
}

export default TrainingModule