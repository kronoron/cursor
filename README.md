# CxSE - Customer Experience Simulation Environment

A Learning Management Software designed to onboard and train team members within sales organizations through AI-powered customer experience simulations.

## 🎯 MVP Focus: Training Module

This MVP build focuses on the **Training Module** that allows users to interact with AI playing the role of customers, generating randomized or pre-set scenarios based on business data.

## 🖼️ UI Design

### Global Styling
- **Dark-themed background** with soft neon lighting effects
- **Light/Dark mode toggle** in user profile
- **Responsive layout** optimized for desktop and mobile
- **Neon color scheme**: Cyan (#00d4ff), Green (#00ff88), Pink (#ff0080), Orange (#ffaa00)

### Layout Elements
- **Top-left**: CxSE logo (clickable → returns to Home)
- **Top-right**: User profile dropdown with settings
- **Bottom-left**: Support & Settings menu
- **Left sidebar**: Module navigation (only Training active in MVP)
- **Main content**: Training options and interfaces

## 🔐 Access Tiers

### User
- Access to training simulations
- Personal analytics
- Profile management
- Cannot upload company data

### Owner
- All User features
- Upload company data for AI scenario generation
- Advanced analytics
- User management capabilities

## 🧪 Training Module Features

### Role-Based AI Simulation
- **AE (Account Executive)**: Enterprise sales scenarios
- **SDR (Sales Development Rep)**: Cold outreach and prospecting
- **BDR (Business Development Rep)**: Inbound lead qualification
- **CSM (Customer Success Manager)**: Customer retention scenarios
- **AM (Account Manager)**: Upselling and expansion opportunities

### Interaction Options
1. **Message Training**: Text-based customer conversations
2. **Call Training**: Voice interaction simulation (uses browser speech APIs)

### Simulation Flow
1. Select training type (Message or Call)
2. AI generates appropriate scenario based on user role
3. AI opens with customer prompt
4. User responds via chat or voice
5. AI replies contextually with realistic responses
6. Session ends with feedback collection

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript** (Vanilla JS - React optional)
- **Font Awesome** for icons
- **CSS Grid & Flexbox** for responsive layout
- **CSS Variables** for theming
- **Speech Synthesis API** for voice features

### Backend
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Body-parser** for request parsing
- **File-based mock database** (JSON storage)

### Database
- **Mock file-based storage** for MVP
- **LocalStorage** for client-side persistence
- Ready for MongoDB/PostgreSQL integration

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser with ES6 support

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Demo Users

The application includes demo users for testing different roles and access levels:

| Username | Role | Access Tier | Features |
|----------|------|-------------|----------|
| john.doe | AE | User | Basic training access |
| sarah.admin | AM | Owner | Full access + data upload |
| mike.sdr | SDR | User | SDR-specific scenarios |
| lisa.csm | CSM | User | Customer success scenarios |

**Note**: In demo mode, users are auto-authenticated. Use the user switcher (bottom-left) to test different access levels.

## 📱 Features

### ✅ Implemented in MVP

#### Core Functionality
- [x] **Dark/Light theme toggle**
- [x] **Responsive design** for desktop and mobile
- [x] **Role-based training scenarios**
- [x] **Message-based AI interactions**
- [x] **Voice simulation** (text-to-speech)
- [x] **Session management** and analytics
- [x] **Feedback collection** system
- [x] **User profile management**
- [x] **Access tier differentiation**

#### Training Features
- [x] **Multiple sales roles** (AE, SDR, BDR, CSM, AM)
- [x] **Contextual AI responses** based on customer profiles
- [x] **Real-time chat interface** with typing indicators
- [x] **Call simulation interface** with controls
- [x] **Session timer** and duration tracking
- [x] **Conversation history** storage

#### AI Simulation
- [x] **Rule-based response generation**
- [x] **Customer personality modeling**
- [x] **Scenario-specific objectives**
- [x] **Dynamic conversation flow**
- [x] **Pain point-driven responses**

#### User Experience
- [x] **Smooth animations** and transitions
- [x] **Loading states** and feedback
- [x] **Error handling** and notifications
- [x] **Keyboard shortcuts** (Alt+H, Alt+T, Esc)
- [x] **Accessible design** considerations

### 🔄 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Server health check | No |
| POST | `/api/auth/login` | User authentication | No |
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update user profile | Yes |
| GET | `/api/training/scenarios` | Get training scenarios | Yes |
| POST | `/api/training/session/start` | Start training session | Yes |
| POST | `/api/training/session/:id/message` | Send message in session | Yes |
| POST | `/api/training/session/:id/end` | End training session | Yes |
| GET | `/api/analytics/sessions` | Get session analytics | Yes |
| POST | `/api/feedback` | Submit feedback | Yes |
| POST | `/api/data/upload` | Upload training data | Owner only |

## 🎮 Usage Guide

### Starting a Training Session

1. **Navigate to Training Module**
   - Click "Training" in the left sidebar
   - Or use keyboard shortcut: `Alt + T`

2. **Choose Interaction Type**
   - **Message Training**: Click "Start Messaging" for text-based practice
   - **Call Training**: Click "Start Calling" for voice-based practice

3. **Engage with AI Customer**
   - AI will present a scenario appropriate to your role
   - Respond naturally as you would in a real customer interaction
   - AI will respond contextually based on customer profile and scenario

4. **End Session**
   - Click "End Session" button
   - Provide feedback on the training experience
   - Review session summary and analytics

### User Profile Management

1. **Access Profile Settings**
   - Click your name in the top-right corner
   - Modify name, role, and access tier
   - Toggle between Light/Dark themes

2. **Role Selection Impact**
   - **AE**: Enterprise sales and renewal scenarios
   - **SDR**: Cold outreach and prospecting
   - **BDR**: Inbound lead qualification
   - **CSM**: Customer success and retention
   - **AM**: Account expansion and upselling

### Owner Features (Admin Access)

1. **Data Upload** (Owner only)
   - Access Support & Settings → Upload Training Data
   - Upload custom scenarios and company information
   - Enhance AI responses with business-specific data

2. **Advanced Analytics** (Owner only)
   - View team-wide performance metrics
   - Access detailed feedback reports
   - Monitor training effectiveness

## 🔧 Development

### Project Structure
```
/workspace
├── package.json              # Dependencies and scripts
├── server.js                 # Express server
├── public/                   # Frontend files
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── styles.css       # Complete styling
│   └── js/
│       ├── app.js           # Core application logic
│       ├── training.js      # Training module
│       └── auth.js          # Authentication
└── README.md                # Documentation
```

### Adding New Features

1. **New Training Scenarios**
   - Edit `trainingScenarios` object in `training.js`
   - Add role-specific scenarios with customer profiles
   - Include objectives and personality traits

2. **Custom AI Responses**
   - Modify `generateContextualResponses()` function
   - Add new response patterns and conditions
   - Integrate with external AI APIs (OpenAI, etc.)

3. **Additional User Roles**
   - Add new roles to user profile options
   - Create corresponding scenario sets
   - Update UI components as needed

## 🎯 Future Enhancements (Post-MVP)

### Planned Features
- [ ] **Onboarding Module**: New user training workflows
- [ ] **Pipeline Module**: Sales pipeline management training
- [ ] **Analytics Module**: Advanced performance metrics
- [ ] **Real AI Integration**: OpenAI GPT or similar LLM
- [ ] **Voice Recognition**: Two-way voice conversations
- [ ] **Multi-user Sessions**: Team training scenarios
- [ ] **Gamification**: Points, badges, leaderboards
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **CRM Integration**: Salesforce, HubSpot connections
- [ ] **Advanced Analytics**: ML-powered insights

### Technical Improvements
- [ ] **Database Integration**: MongoDB/PostgreSQL
- [ ] **Real Authentication**: JWT with proper security
- [ ] **File Upload System**: Secure document handling
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Caching Layer**: Redis for performance
- [ ] **Load Balancing**: Multiple server instances
- [ ] **Monitoring**: Error tracking and performance metrics

## 🔒 Security Considerations

### Current Implementation (MVP)
- Simple token-based authentication
- Client-side data storage
- Basic input validation
- CORS protection

### Production Requirements
- [ ] **HTTPS encryption**
- [ ] **JWT token authentication**
- [ ] **Password hashing** (bcrypt)
- [ ] **Input sanitization**
- [ ] **Rate limiting**
- [ ] **SQL injection protection**
- [ ] **XSS prevention**
- [ ] **CSRF protection**

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Mock Authentication**: Demo users only, no real login system
2. **Simple AI**: Rule-based responses, not true AI conversations
3. **File Storage**: Data stored in memory, lost on server restart
4. **Voice Features**: Basic browser APIs, limited voice recognition
5. **Mobile Optimization**: Responsive but not native mobile experience

### Browser Compatibility
- **Chrome**: Full feature support
- **Firefox**: Full feature support
- **Safari**: Limited voice synthesis
- **Edge**: Full feature support
- **IE**: Not supported

## 📞 Support & Feedback

### Getting Help
- **Documentation**: This README file
- **Support Menu**: Bottom-left corner of application
- **Issue Reporting**: Use the feedback system in-app

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for icon library
- **Express.js** community for excellent documentation
- **Speech Synthesis API** for voice capabilities
- **CSS Grid** and **Flexbox** for responsive design

---

**🚀 Ready to transform your sales training? Start with CxSE today!**

For questions or support, contact: [support@cxse.com](mailto:support@cxse.com)