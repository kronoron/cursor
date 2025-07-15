const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ===== MOCK DATA STORAGE =====
// In production, this would use a proper database
let mockDatabase = {
    users: [
        {
            id: 1,
            username: 'john.doe',
            email: 'john.doe@company.com',
            name: 'John Doe',
            role: 'AE',
            accessTier: 'User',
            passwordHash: 'hashed_password_123',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            username: 'sarah.admin',
            email: 'sarah.admin@company.com',
            name: 'Sarah Admin',
            role: 'AM',
            accessTier: 'Owner',
            passwordHash: 'hashed_admin_123',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            username: 'mike.sdr',
            email: 'mike.sdr@company.com',
            name: 'Mike Johnson',
            role: 'SDR',
            accessTier: 'User',
            passwordHash: 'hashed_sdr_123',
            createdAt: new Date().toISOString()
        }
    ],
    trainingSessions: [],
    feedback: [],
    trainingData: {
        scenarios: {
            AE: [
                {
                    id: 'ae_enterprise_renewal',
                    title: 'Enterprise Contract Renewal',
                    difficulty: 'intermediate',
                    customerProfile: {
                        name: 'Sarah Chen',
                        company: 'TechCorp Industries',
                        role: 'VP of Operations',
                        budget: '$150K',
                        pain_points: ['cost concerns', 'feature gaps', 'competitor interest'],
                        personality: 'analytical, data-driven, skeptical'
                    },
                    objectives: ['Address cost concerns', 'Highlight ROI', 'Secure renewal']
                }
            ],
            SDR: [
                {
                    id: 'sdr_cold_outreach',
                    title: 'Cold Outreach - SaaS Startup',
                    difficulty: 'beginner',
                    customerProfile: {
                        name: 'Alex Thompson',
                        company: 'StartupFlow',
                        role: 'Founder',
                        budget: '$25K',
                        pain_points: ['manual processes', 'time management'],
                        personality: 'busy, results-focused'
                    },
                    objectives: ['Qualify budget', 'Identify pain points', 'Schedule demo']
                }
            ]
        },
        companyData: {
            products: [
                {
                    name: 'CxSE Platform',
                    features: ['AI Training', 'Analytics', 'Integration'],
                    pricing: ['Basic $99/mo', 'Pro $299/mo', 'Enterprise $999/mo']
                }
            ],
            competitors: ['Competitor A', 'Competitor B'],
            caseStudies: [
                {
                    company: 'TechCorp',
                    results: '30% increase in conversion rates',
                    industry: 'SaaS'
                }
            ]
        }
    }
};

// ===== UTILITY FUNCTIONS =====
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Simple token validation for MVP (in production, use proper JWT validation)
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [userId, expiresAt] = decoded.split(':');
        
        if (new Date().getTime() > parseInt(expiresAt)) {
            return res.status(401).json({ error: 'Token expired' });
        }
        
        const user = mockDatabase.users.find(u => u.id === parseInt(userId));
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token format' });
    }
}

function requireOwnerAccess(req, res, next) {
    if (req.user.accessTier !== 'Owner') {
        return res.status(403).json({ error: 'Owner access required' });
    }
    next();
}

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Mock authentication (in production, use proper password hashing)
    const user = mockDatabase.users.find(u => 
        (u.username === username || u.email === username)
    );
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate session token
    const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
    const token = Buffer.from(`${user.id}:${expiresAt}`).toString('base64');
    
    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessTier: user.accessTier
        },
        token,
        expiresAt
    });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
    // In production, invalidate the token in database
    res.json({ success: true, message: 'Logged out successfully' });
});

// User profile routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const { passwordHash, ...userProfile } = req.user;
    res.json(userProfile);
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { name, role, theme } = req.body;
    
    // Find and update user
    const userIndex = mockDatabase.users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
        mockDatabase.users[userIndex] = {
            ...mockDatabase.users[userIndex],
            name: name || mockDatabase.users[userIndex].name,
            role: role || mockDatabase.users[userIndex].role
        };
        
        const { passwordHash, ...updatedUser } = mockDatabase.users[userIndex];
        res.json(updatedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Training routes
app.get('/api/training/scenarios', authenticateToken, (req, res) => {
    const userRole = req.user.role;
    const scenarios = mockDatabase.trainingData.scenarios[userRole] || 
                     mockDatabase.trainingData.scenarios.AE;
    
    res.json({
        scenarios,
        totalCount: scenarios.length,
        userRole
    });
});

app.get('/api/training/scenarios/:role', authenticateToken, (req, res) => {
    const { role } = req.params;
    const scenarios = mockDatabase.trainingData.scenarios[role] || [];
    
    res.json({
        scenarios,
        role,
        totalCount: scenarios.length
    });
});

app.post('/api/training/session/start', authenticateToken, (req, res) => {
    const { type, scenarioId } = req.body;
    
    // Find scenario
    const userRole = req.user.role;
    const scenarios = mockDatabase.trainingData.scenarios[userRole] || 
                     mockDatabase.trainingData.scenarios.AE;
    const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0];
    
    const session = {
        id: `session_${Date.now()}_${req.user.id}`,
        userId: req.user.id,
        type,
        scenarioId: scenario.id,
        startTime: new Date().toISOString(),
        status: 'active',
        conversationHistory: []
    };
    
    mockDatabase.trainingSessions.push(session);
    
    res.json({
        session,
        scenario,
        initialMessage: getInitialMessage(scenario)
    });
});

app.post('/api/training/session/:sessionId/message', authenticateToken, (req, res) => {
    const { sessionId } = req.params;
    const { message, sender } = req.body;
    
    const session = mockDatabase.trainingSessions.find(s => 
        s.id === sessionId && s.userId === req.user.id
    );
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    // Add message to conversation history
    const messageData = {
        message,
        sender,
        timestamp: new Date().toISOString()
    };
    
    session.conversationHistory.push(messageData);
    
    // Generate AI response if user message
    let aiResponse = null;
    if (sender === 'user') {
        aiResponse = generateAIResponse(message, session);
        session.conversationHistory.push({
            message: aiResponse,
            sender: 'ai',
            timestamp: new Date().toISOString()
        });
    }
    
    res.json({
        success: true,
        messageAdded: messageData,
        aiResponse: aiResponse ? {
            message: aiResponse,
            sender: 'ai',
            timestamp: new Date().toISOString()
        } : null
    });
});

app.post('/api/training/session/:sessionId/end', authenticateToken, (req, res) => {
    const { sessionId } = req.params;
    
    const sessionIndex = mockDatabase.trainingSessions.findIndex(s => 
        s.id === sessionId && s.userId === req.user.id
    );
    
    if (sessionIndex === -1) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = mockDatabase.trainingSessions[sessionIndex];
    session.endTime = new Date().toISOString();
    session.status = 'completed';
    session.duration = Math.floor(
        (new Date(session.endTime) - new Date(session.startTime)) / 1000
    );
    
    res.json({
        success: true,
        session,
        summary: {
            duration: session.duration,
            messageCount: session.conversationHistory.length,
            scenario: session.scenarioId
        }
    });
});

// Analytics routes
app.get('/api/analytics/sessions', authenticateToken, (req, res) => {
    const userSessions = mockDatabase.trainingSessions.filter(s => s.userId === req.user.id);
    
    const stats = {
        totalSessions: userSessions.length,
        totalDuration: userSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        averageDuration: userSessions.length > 0 ? 
            Math.floor(userSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / userSessions.length) : 0,
        messagesSent: userSessions.reduce((sum, s) => sum + s.conversationHistory.length, 0),
        scenariosCompleted: [...new Set(userSessions.map(s => s.scenarioId))].length,
        recentSessions: userSessions.slice(-5).reverse()
    };
    
    res.json(stats);
});

// Feedback routes
app.post('/api/feedback', authenticateToken, (req, res) => {
    const { rating, comment, sessionId } = req.body;
    
    const feedback = {
        id: `feedback_${Date.now()}`,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        rating,
        comment,
        sessionId,
        timestamp: new Date().toISOString()
    };
    
    mockDatabase.feedback.push(feedback);
    
    res.json({
        success: true,
        feedback
    });
});

app.get('/api/feedback', authenticateToken, requireOwnerAccess, (req, res) => {
    res.json({
        feedback: mockDatabase.feedback,
        totalCount: mockDatabase.feedback.length,
        averageRating: mockDatabase.feedback.length > 0 ? 
            (mockDatabase.feedback.reduce((sum, f) => sum + f.rating, 0) / mockDatabase.feedback.length).toFixed(1) : 0
    });
});

// Data upload routes (Owner only)
app.post('/api/data/upload', authenticateToken, requireOwnerAccess, (req, res) => {
    const { dataType, data } = req.body;
    
    try {
        if (dataType === 'scenarios') {
            // Validate and add scenarios
            if (Array.isArray(data)) {
                data.forEach(scenario => {
                    const role = scenario.role || 'AE';
                    if (!mockDatabase.trainingData.scenarios[role]) {
                        mockDatabase.trainingData.scenarios[role] = [];
                    }
                    mockDatabase.trainingData.scenarios[role].push({
                        ...scenario,
                        id: scenario.id || `custom_${Date.now()}`,
                        uploadedBy: req.user.id,
                        uploadedAt: new Date().toISOString()
                    });
                });
            }
        } else if (dataType === 'companyData') {
            // Update company data
            mockDatabase.trainingData.companyData = {
                ...mockDatabase.trainingData.companyData,
                ...data,
                lastUpdated: new Date().toISOString(),
                updatedBy: req.user.id
            };
        }
        
        res.json({
            success: true,
            message: 'Data uploaded successfully',
            dataType,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            error: 'Invalid data format',
            details: error.message
        });
    }
});

app.get('/api/data/company', authenticateToken, (req, res) => {
    res.json(mockDatabase.trainingData.companyData);
});

// ===== AI RESPONSE GENERATION =====
function getInitialMessage(scenario) {
    const initialMessages = [
        `Hi there, I wanted to discuss our ${scenario.title.toLowerCase()}.`,
        `Good morning! I have some questions about your platform.`,
        `Hello, I was referred to you by a colleague. Can we talk?`,
        `Hi, I've been researching solutions and came across your company.`
    ];
    
    return initialMessages[Math.floor(Math.random() * initialMessages.length)];
}

function generateAIResponse(userMessage, session) {
    // Find the scenario
    const userRole = mockDatabase.users.find(u => u.id === session.userId)?.role || 'AE';
    const scenarios = mockDatabase.trainingData.scenarios[userRole] || 
                     mockDatabase.trainingData.scenarios.AE;
    const scenario = scenarios.find(s => s.id === session.scenarioId);
    
    if (!scenario) {
        return "I'm sorry, could you repeat that?";
    }
    
    const message = userMessage.toLowerCase();
    const customer = scenario.customerProfile;
    
    // Simple rule-based responses (in production, this would use actual AI/LLM)
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
        if (customer.personality && customer.personality.includes('analytical')) {
            return `Our budget is around ${customer.budget}. I need to see a detailed cost breakdown and ROI analysis.`;
        }
        return `Cost is definitely a factor. What pricing options do you have?`;
    }
    
    if (message.includes('feature') || message.includes('functionality')) {
        return `What specific features would address our main challenges with ${customer.pain_points?.join(' and ') || 'our current process'}?`;
    }
    
    if (message.includes('timeline') || message.includes('when')) {
        return "We're looking to make a decision within the next month. What's your implementation timeline?";
    }
    
    if (message.includes('demo') || message.includes('show')) {
        return "That sounds interesting. Can you show me how this would work specifically for our use case?";
    }
    
    // Default responses based on personality
    const responses = [
        "That's interesting. Tell me more about how that works.",
        "How does this compare to other solutions we're considering?",
        "What kind of results have you seen with companies like ours?",
        "I need to understand the implementation process better.",
        "Can you provide some case studies or references?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// ===== ERROR HANDLING =====
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        // Serve index.html for all non-API routes (SPA routing)
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ===== SERVER STARTUP =====
app.listen(PORT, () => {
    console.log('🚀 CxSE Server Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log('⚡ Ready for training simulations!');
    
    // Log available endpoints
    console.log('\n📋 Available API Endpoints:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/training/scenarios');
    console.log('   POST /api/training/session/start');
    console.log('   GET  /api/analytics/sessions');
    console.log('   POST /api/feedback');
    console.log('   POST /api/data/upload (Owner only)');
    console.log('\n🎮 Open http://localhost:3000 to start training!');
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    // In production, close database connections, save data, etc.
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;