// ===== TRAINING MODULE =====

let trainingState = {
    isActive: false,
    type: null, // 'message' or 'call'
    scenario: null,
    customerProfile: null,
    conversationHistory: [],
    startTime: null,
    isMuted: false,
    isSpeakerOn: true
};

// ===== TRAINING SCENARIOS =====
const trainingScenarios = {
    AE: [
        {
            id: 'ae_enterprise_renewal',
            title: 'Enterprise Contract Renewal',
            customerProfile: {
                name: 'Sarah Chen',
                company: 'TechCorp Industries',
                role: 'VP of Operations',
                budget: '$150K',
                pain_points: ['cost concerns', 'feature gaps', 'competitor interest'],
                personality: 'analytical, data-driven, skeptical'
            },
            initialMessage: "Hi there, I wanted to discuss our contract renewal. I've been reviewing our costs and I'm not sure we're getting the value we expected from your platform.",
            objectives: ['Address cost concerns', 'Highlight ROI', 'Secure renewal']
        },
        {
            id: 'ae_new_enterprise',
            title: 'New Enterprise Prospect',
            customerProfile: {
                name: 'Michael Rodriguez',
                company: 'GlobalTech Solutions',
                role: 'CTO',
                budget: '$300K',
                pain_points: ['scalability issues', 'integration complexity', 'team productivity'],
                personality: 'technical, detail-oriented, cautious'
            },
            initialMessage: "We're evaluating solutions for our growing team. I've heard good things about your platform, but I need to understand how it would integrate with our existing tech stack.",
            objectives: ['Understand technical requirements', 'Demo integration capabilities', 'Move to next stage']
        }
    ],
    SDR: [
        {
            id: 'sdr_cold_outreach',
            title: 'Cold Outreach - SaaS Startup',
            customerProfile: {
                name: 'Alex Thompson',
                company: 'StartupFlow',
                role: 'Founder',
                budget: '$25K',
                pain_points: ['manual processes', 'time management', 'scaling challenges'],
                personality: 'busy, results-focused, open to innovation'
            },
            initialMessage: "I got your message about improving our workflow processes. We're pretty busy scaling right now - what exactly are you proposing?",
            objectives: ['Qualify budget and timeline', 'Identify pain points', 'Schedule demo']
        }
    ],
    BDR: [
        {
            id: 'bdr_inbound_lead',
            title: 'Inbound Lead Follow-up',
            customerProfile: {
                name: 'Jennifer Park',
                company: 'MidSize Corp',
                role: 'Director of Marketing',
                budget: '$75K',
                pain_points: ['lead generation', 'campaign tracking', 'ROI measurement'],
                personality: 'marketing-focused, metrics-driven, collaborative'
            },
            initialMessage: "Hi! I downloaded your whitepaper last week about marketing automation. I'm interested in learning more about how your solution could help us improve our lead generation.",
            objectives: ['Understand current challenges', 'Qualify decision process', 'Book qualified meeting']
        }
    ],
    CSM: [
        {
            id: 'csm_churn_risk',
            title: 'At-Risk Customer Check-in',
            customerProfile: {
                name: 'David Kim',
                company: 'TechServices Inc',
                role: 'Head of Operations',
                budget: '$100K',
                pain_points: ['low adoption', 'team resistance', 'unclear ROI'],
                personality: 'frustrated, time-pressed, needs support'
            },
            initialMessage: "I need to be honest - our team is struggling with adoption of your platform. Usage has been declining and I'm getting pressure from leadership about our investment.",
            objectives: ['Identify adoption barriers', 'Create success plan', 'Prevent churn']
        }
    ],
    AM: [
        {
            id: 'am_upsell_opportunity',
            title: 'Expansion Opportunity',
            customerProfile: {
                name: 'Lisa Wang',
                company: 'GrowthCo',
                role: 'VP of Sales',
                budget: '$200K',
                pain_points: ['team growth', 'process scaling', 'advanced analytics needs'],
                personality: 'growth-oriented, ambitious, data-focused'
            },
            initialMessage: "Our team has been really successful with your current package. We're scaling rapidly and I'm wondering if there are additional features that could help us manage this growth better.",
            objectives: ['Identify expansion needs', 'Present relevant features', 'Negotiate upgrade']
        }
    ]
};

// ===== TRAINING FLOW =====
function startTraining(type) {
    if (trainingState.isActive) {
        if (confirm('You have an active training session. End it and start a new one?')) {
            endSession();
        } else {
            return;
        }
    }

    trainingState.type = type;
    trainingState.isActive = true;
    trainingState.startTime = new Date();
    
    // Get user role to select appropriate scenarios
    const userRole = window.CxSE.currentUser.role;
    const scenarios = trainingScenarios[userRole] || trainingScenarios.AE;
    
    // Select random scenario
    trainingState.scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    trainingState.customerProfile = trainingState.scenario.customerProfile;
    
    window.CxSE.showLoading(true);
    
    // Simulate preparation time
    setTimeout(() => {
        window.CxSE.showLoading(false);
        showTrainingInterface(type);
        initializeTrainingSession();
    }, 2000);
}

function showTrainingInterface(type) {
    // Hide training options, show interface
    document.getElementById('training-content').classList.remove('active');
    document.getElementById('training-interface').classList.add('active');
    
    // Update session title
    document.getElementById('session-title').textContent = 
        `${trainingState.scenario.title} - ${trainingState.customerProfile.name}`;
    
    if (type === 'message') {
        document.getElementById('message-interface').style.display = 'block';
        document.getElementById('call-interface').style.display = 'none';
    } else {
        document.getElementById('message-interface').style.display = 'none';
        document.getElementById('call-interface').style.display = 'block';
        document.getElementById('customer-name').textContent = trainingState.customerProfile.name;
        window.CxSE.startSessionTimer();
    }
}

function initializeTrainingSession() {
    if (trainingState.type === 'message') {
        // Add initial AI message
        addChatMessage(trainingState.scenario.initialMessage, 'ai');
        
        // Focus on input
        document.getElementById('message-input').focus();
    } else {
        // Simulate incoming call
        setTimeout(() => {
            speakMessage(trainingState.scenario.initialMessage);
        }, 1000);
    }
    
    window.CxSE.showNotification(`Training started: ${trainingState.scenario.title}`, 'success');
}

// ===== CHAT INTERFACE =====
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to conversation history
    trainingState.conversationHistory.push({
        message,
        sender,
        timestamp: now.toISOString()
    });
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1500 + Math.random() * 2000); // Realistic response time
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add CSS for typing animation
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots span {
            animation: typing 1.4s infinite;
        }
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ===== AI RESPONSE GENERATION =====
function generateAIResponse(userMessage) {
    const customer = trainingState.customerProfile;
    const scenario = trainingState.scenario;
    
    // Simple rule-based responses for MVP (in production, this would use actual AI/LLM)
    const responses = generateContextualResponses(userMessage, customer, scenario);
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateContextualResponses(userMessage, customer, scenario) {
    const message = userMessage.toLowerCase();
    
    // Price/Cost related responses
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
        if (customer.personality.includes('cost concerns')) {
            return [
                "Price is definitely a concern for us. We need to see clear ROI before committing to any increase.",
                "I've been asked to reduce costs across the board. Can you work with our current budget?",
                "We're comparing several options right now, and cost is a major factor in our decision."
            ];
        }
        return [
            `Our budget is around ${customer.budget}. What options do you have in that range?`,
            "Cost is important, but we're more focused on value and ROI.",
            "I need to understand the total cost of ownership, including implementation and training."
        ];
    }
    
    // Features/Technical responses
    if (message.includes('feature') || message.includes('integration') || message.includes('technical')) {
        if (customer.personality.includes('technical')) {
            return [
                "I need detailed technical specifications. What APIs do you support?",
                "How does this integrate with our existing systems? We use Salesforce and HubSpot.",
                "Our team is very technical. Can you show us the developer documentation?"
            ];
        }
        return [
            "What specific features would help with our main challenges?",
            "How easy is it for non-technical users to adopt this?",
            "Can you walk me through how this would work for our use case?"
        ];
    }
    
    // Timeline/Process responses
    if (message.includes('when') || message.includes('timeline') || message.includes('implement')) {
        return [
            "We're looking to make a decision by the end of this quarter.",
            "How long does implementation typically take?",
            "What's the timeline for getting our team trained and up to speed?"
        ];
    }
    
    // Competitor mentions
    if (message.includes('competitor') || message.includes('alternative') || message.includes('compare')) {
        return [
            "We're also looking at [Competitor X]. How do you differentiate?",
            "What makes your solution better than the alternatives?",
            "I've heard good things about [Other Platform]. Why should we choose you?"
        ];
    }
    
    // Pain point related
    const painPointResponses = customer.pain_points.map(pain => {
        switch(pain) {
            case 'low adoption':
                return "Our biggest challenge is getting the team to actually use new tools.";
            case 'manual processes':
                return "We're spending way too much time on manual tasks that should be automated.";
            case 'scalability issues':
                return "Our current system can't handle our growth. We need something that scales.";
            case 'integration complexity':
                return "Every new tool creates more complexity. We need something that plays well with our stack.";
            default:
                return `We're really struggling with ${pain}.`;
        }
    });
    
    // Default responses based on personality
    if (customer.personality.includes('skeptical')) {
        return [
            "I've heard promises like this before. What proof do you have?",
            "How do I know this will actually work for our specific situation?",
            "What guarantees do you offer if this doesn't deliver the results you're promising?"
        ];
    }
    
    if (customer.personality.includes('busy')) {
        return [
            "I only have a few minutes. Can you give me the key points?",
            "Cut to the chase - what's the bottom line here?",
            "I need to see clear value quickly. What's your strongest case study?"
        ];
    }
    
    // Fallback responses
    return [
        "That's interesting. Tell me more about how that would work.",
        "I need to think about that. What else can you show me?",
        "That sounds good in theory, but how does it work in practice?",
        "Can you give me a specific example of how that's helped other companies like ours?",
        ...painPointResponses
    ];
}

// ===== CALL INTERFACE =====
function toggleMute() {
    trainingState.isMuted = !trainingState.isMuted;
    const muteBtn = document.querySelector('.mute-btn i');
    
    if (trainingState.isMuted) {
        muteBtn.className = 'fas fa-microphone-slash';
        window.CxSE.showNotification('Microphone muted', 'warning');
    } else {
        muteBtn.className = 'fas fa-microphone';
        window.CxSE.showNotification('Microphone unmuted', 'success');
    }
}

function toggleSpeaker() {
    trainingState.isSpeakerOn = !trainingState.isSpeakerOn;
    const speakerBtn = document.querySelector('.speaker-btn i');
    
    if (trainingState.isSpeakerOn) {
        speakerBtn.className = 'fas fa-volume-up';
    } else {
        speakerBtn.className = 'fas fa-volume-mute';
        window.CxSE.showNotification('Speaker muted', 'warning');
    }
}

function endCall() {
    endSession();
}

function speakMessage(message) {
    // For MVP, we'll use browser's speech synthesis
    // In production, this would integrate with voice AI services
    if ('speechSynthesis' in window && trainingState.isSpeakerOn) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a different voice for the customer
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
    
    window.CxSE.showNotification(`${trainingState.customerProfile.name}: ${message}`, 'info');
}

// ===== SESSION MANAGEMENT =====
function endSession() {
    if (!trainingState.isActive) return;
    
    // Calculate session duration
    const duration = Math.floor((new Date() - trainingState.startTime) / 1000);
    
    // Stop any timers
    window.CxSE.stopSessionTimer();
    
    // Stop any speech
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    
    // Save session data
    const sessionData = {
        id: `session_${Date.now()}`,
        type: trainingState.type,
        scenario: trainingState.scenario.id,
        duration: duration,
        messageCount: trainingState.conversationHistory.length,
        userRole: window.CxSE.currentUser.role,
        timestamp: new Date().toISOString(),
        conversationHistory: trainingState.conversationHistory
    };
    
    // Save to localStorage (in production, would save to backend)
    try {
        const sessions = JSON.parse(localStorage.getItem('cxse_training_sessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('cxse_training_sessions', JSON.stringify(sessions));
    } catch (error) {
        console.error('Failed to save session data:', error);
    }
    
    // Reset state
    trainingState = {
        isActive: false,
        type: null,
        scenario: null,
        customerProfile: null,
        conversationHistory: [],
        startTime: null,
        isMuted: false,
        isSpeakerOn: true
    };
    
    // Clear chat messages
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Show feedback modal
    window.CxSE.showFeedbackModal();
    
    // Return to training selection
    setTimeout(() => {
        document.getElementById('training-interface').classList.remove('active');
        document.getElementById('training-content').classList.add('active');
    }, 500);
    
    window.CxSE.showNotification(`Session ended. Duration: ${window.CxSE.formatTime(duration)}`, 'info');
}

// ===== VOICE RECOGNITION (Future Enhancement) =====
function startVoiceRecognition() {
    // This would integrate with speech recognition APIs
    // For MVP, we'll simulate this functionality
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            // Process voice input
            handleVoiceInput(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };
        
        recognition.start();
    }
}

function handleVoiceInput(transcript) {
    // Process the voice input and generate appropriate AI response
    window.CxSE.showNotification(`You said: ${transcript}`, 'info');
    
    // Generate AI response to voice input
    setTimeout(() => {
        const response = generateAIResponse(transcript);
        speakMessage(response);
    }, 1000);
}

// ===== TRAINING ANALYTICS =====
function getTrainingStats() {
    try {
        const sessions = JSON.parse(localStorage.getItem('cxse_training_sessions') || '[]');
        const userSessions = sessions.filter(s => s.userRole === window.CxSE.currentUser.role);
        
        return {
            totalSessions: userSessions.length,
            totalDuration: userSessions.reduce((sum, s) => sum + s.duration, 0),
            averageDuration: userSessions.length > 0 ? 
                Math.floor(userSessions.reduce((sum, s) => sum + s.duration, 0) / userSessions.length) : 0,
            messagesSent: userSessions.reduce((sum, s) => sum + s.messageCount, 0),
            scenariosCompleted: [...new Set(userSessions.map(s => s.scenario))].length
        };
    } catch (error) {
        console.error('Failed to get training stats:', error);
        return null;
    }
}

// ===== EXPORT FUNCTIONS =====
window.TrainingModule = {
    startTraining,
    endSession,
    sendMessage,
    handleKeyPress,
    toggleMute,
    toggleSpeaker,
    endCall,
    getTrainingStats
};