// ===== GLOBAL STATE =====
let currentUser = {
    name: 'John Doe',
    role: 'AE',
    accessTier: 'User',
    theme: 'dark'
};

let currentSession = null;
let sessionTimer = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserProfile();
    showModule('home');
});

function initializeApp() {
    // Set initial theme
    setTheme(currentUser.theme);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        closeAllDropdowns(event);
    });
    
    // Initialize profile form
    updateProfileForm();
    
    console.log('CxSE Application initialized');
}

// ===== THEME MANAGEMENT =====
function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.checked = false;
    } else {
        body.removeAttribute('data-theme');
        if (themeToggle) themeToggle.checked = true;
    }
    
    currentUser.theme = theme;
}

function toggleTheme() {
    const newTheme = currentUser.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveUserProfile();
}

// Add event listener for theme toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
});

// ===== NAVIGATION =====
function goHome() {
    showModule('home');
    // Update URL without page refresh
    if (history.pushState) {
        history.pushState(null, null, '/');
    }
}

function showModule(moduleName) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all module buttons
    const moduleButtons = document.querySelectorAll('.module-btn');
    moduleButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected module
    let targetSection;
    switch(moduleName) {
        case 'home':
            targetSection = document.getElementById('home-content');
            break;
        case 'training':
            targetSection = document.getElementById('training-content');
            // Make training button active
            const trainingBtn = document.querySelector('.module-btn[onclick*="training"]');
            if (trainingBtn) trainingBtn.classList.add('active');
            break;
        case 'onboarding':
        case 'pipeline':
        case 'analytics':
        case 'other':
            // These modules are disabled for MVP
            showNotification(`${moduleName} module coming soon!`, 'info');
            return;
        default:
            targetSection = document.getElementById('home-content');
    }
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// ===== PROFILE MANAGEMENT =====
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

function updateProfileForm() {
    document.getElementById('user-name').value = currentUser.name;
    document.getElementById('user-role').value = currentUser.role;
    document.getElementById('access-tier').value = currentUser.accessTier;
    document.getElementById('current-user-name').textContent = currentUser.name;
}

function saveProfile() {
    // Get values from form
    const name = document.getElementById('user-name').value.trim();
    const role = document.getElementById('user-role').value;
    const accessTier = document.getElementById('access-tier').value;
    
    // Validate
    if (!name) {
        showNotification('Name cannot be empty', 'error');
        return;
    }
    
    // Update user object
    currentUser.name = name;
    currentUser.role = role;
    currentUser.accessTier = accessTier;
    
    // Update UI
    document.getElementById('current-user-name').textContent = name;
    
    // Save to localStorage (in real app, this would be an API call)
    saveUserProfile();
    
    // Close dropdown
    toggleProfileDropdown();
    
    showNotification('Profile updated successfully!', 'success');
}

function saveUserProfile() {
    try {
        localStorage.setItem('cxse_user_profile', JSON.stringify(currentUser));
    } catch (error) {
        console.error('Failed to save user profile:', error);
    }
}

function loadUserProfile() {
    try {
        const savedProfile = localStorage.getItem('cxse_user_profile');
        if (savedProfile) {
            currentUser = { ...currentUser, ...JSON.parse(savedProfile) };
            updateProfileForm();
            setTheme(currentUser.theme);
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }
}

// ===== SUPPORT MENU =====
function toggleSupportMenu() {
    const dropdown = document.getElementById('support-dropdown');
    dropdown.classList.toggle('show');
}

function showSupport(type) {
    const messages = {
        about: 'CxSE v1.0 - Customer Experience Simulation Environment\n\nBuilt for sales training and development.',
        contact: 'Contact Support:\n\nEmail: support@cxse.com\nPhone: +1 (555) 123-4567',
        feedback: 'We value your feedback!\n\nPlease share your thoughts about CxSE to help us improve.',
        integrations: 'Integrations:\n\n• CRM Systems\n• Communication Tools\n• Analytics Platforms\n\nComing soon!',
        uploads: 'Data Uploads:\n\nOwners can upload company data to enhance AI scenarios.\n\nSupported formats: JSON, CSV, TXT',
        introduction: 'Welcome to CxSE!\n\nThis platform helps you practice customer interactions using AI simulations.\n\nStart with the Training module to begin.'
    };
    
    alert(messages[type] || 'Feature coming soon!');
    toggleSupportMenu();
}

// ===== UTILITY FUNCTIONS =====
function closeAllDropdowns(event) {
    const profileDropdown = document.getElementById('profile-dropdown');
    const supportDropdown = document.getElementById('support-dropdown');
    
    // Close profile dropdown if clicking outside
    if (!event.target.closest('.user-profile')) {
        profileDropdown.classList.remove('show');
    }
    
    // Close support dropdown if clicking outside
    if (!event.target.closest('.support-menu')) {
        supportDropdown.classList.remove('show');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '3000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#00ff88',
        error: '#ff0080',
        warning: '#ffaa00',
        info: '#00d4ff'
    };
    notification.style.background = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ===== SESSION MANAGEMENT =====
function startSessionTimer() {
    let seconds = 0;
    sessionTimer = setInterval(() => {
        seconds++;
        const timerElement = document.getElementById('call-timer');
        if (timerElement) {
            timerElement.textContent = formatTime(seconds);
        }
    }, 1000);
}

function stopSessionTimer() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
}

// ===== FEEDBACK SYSTEM =====
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitFeedback() {
    const feedbackText = document.getElementById('feedback-text').value.trim();
    
    if (currentRating === 0) {
        showNotification('Please provide a rating', 'warning');
        return;
    }
    
    // Create feedback object
    const feedback = {
        rating: currentRating,
        comment: feedbackText,
        userId: currentUser.name,
        userRole: currentUser.role,
        sessionType: currentSession?.type || 'unknown',
        timestamp: new Date().toISOString()
    };
    
    // In a real app, this would be sent to the backend
    console.log('Feedback submitted:', feedback);
    
    // Save to localStorage for demo purposes
    try {
        const existingFeedback = JSON.parse(localStorage.getItem('cxse_feedback') || '[]');
        existingFeedback.push(feedback);
        localStorage.setItem('cxse_feedback', JSON.stringify(existingFeedback));
    } catch (error) {
        console.error('Failed to save feedback:', error);
    }
    
    showNotification('Thank you for your feedback!', 'success');
    closeFeedbackModal();
}

function showFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    modal.classList.add('show');
    
    // Reset form
    currentRating = 0;
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.getElementById('feedback-text').value = '';
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('show');
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(event) {
    // Escape key closes modals and dropdowns
    if (event.key === 'Escape') {
        closeFeedbackModal();
        document.getElementById('profile-dropdown').classList.remove('show');
        document.getElementById('support-dropdown').classList.remove('show');
    }
    
    // Alt + H for home
    if (event.altKey && event.key === 'h') {
        event.preventDefault();
        goHome();
    }
    
    // Alt + T for training
    if (event.altKey && event.key === 't') {
        event.preventDefault();
        showModule('training');
    }
});

// ===== API HELPERS =====
async function apiCall(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`/api${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Network error. Please try again.', 'error');
        throw error;
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showNotification('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred', 'error');
});

// ===== EXPORT FOR OTHER MODULES =====
window.CxSE = {
    currentUser,
    showNotification,
    showLoading,
    apiCall,
    formatTime,
    startSessionTimer,
    stopSessionTimer,
    showFeedbackModal
};