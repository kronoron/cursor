// ===== AUTHENTICATION MODULE =====

let authState = {
    isAuthenticated: false,
    currentUser: null,
    accessTier: 'User'
};

// ===== MOCK USER DATABASE =====
const mockUsers = [
    {
        id: 1,
        username: 'john.doe',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'AE',
        accessTier: 'User',
        password: 'password123' // In real app, this would be hashed
    },
    {
        id: 2,
        username: 'sarah.admin',
        email: 'sarah.admin@company.com',
        name: 'Sarah Admin',
        role: 'AM',
        accessTier: 'Owner',
        password: 'admin123'
    },
    {
        id: 3,
        username: 'mike.sdr',
        email: 'mike.sdr@company.com',
        name: 'Mike Johnson',
        role: 'SDR',
        accessTier: 'User',
        password: 'sdr123'
    },
    {
        id: 4,
        username: 'lisa.csm',
        email: 'lisa.csm@company.com',
        name: 'Lisa Wang',
        role: 'CSM',
        accessTier: 'User',
        password: 'csm123'
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    checkAuthenticationStatus();
    
    // Set up demo login if needed
    if (!authState.isAuthenticated) {
        setupDemoLogin();
    }
});

function checkAuthenticationStatus() {
    // Check localStorage for saved session
    const savedAuth = localStorage.getItem('cxse_auth');
    
    if (savedAuth) {
        try {
            const authData = JSON.parse(savedAuth);
            if (authData && isValidSession(authData)) {
                authState = authData;
                setCurrentUser(authData.currentUser);
                return true;
            }
        } catch (error) {
            console.error('Failed to parse saved auth data:', error);
            clearAuthData();
        }
    }
    
    return false;
}

function isValidSession(authData) {
    // Check if session is still valid (not expired)
    if (!authData.expiresAt) return false;
    
    const now = new Date().getTime();
    return now < authData.expiresAt;
}

// ===== DEMO LOGIN SETUP =====
function setupDemoLogin() {
    // For MVP, we'll auto-authenticate with a demo user
    // In production, this would show a proper login screen
    
    // Use the first user as default
    const demoUser = mockUsers[0];
    authenticateUser(demoUser);
    
    console.log('Demo mode: Auto-authenticated as', demoUser.name);
    
    // Show quick access buttons for different user types (demo only)
    setTimeout(() => {
        showUserSwitcher();
    }, 3000);
}

function showUserSwitcher() {
    // Create a demo user switcher for testing different access levels
    const switcher = document.createElement('div');
    switcher.id = 'demo-user-switcher';
    switcher.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: var(--bg-card); 
                    border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; 
                    z-index: 1000; font-size: 0.8rem;">
            <div style="margin-bottom: 0.5rem; color: var(--neon-primary); font-weight: bold;">
                🎭 Demo Mode - Quick User Switch
            </div>
            <button onclick="switchUser(0)" style="margin: 2px; padding: 4px 8px; font-size: 0.7rem;">
                AE (User)
            </button>
            <button onclick="switchUser(1)" style="margin: 2px; padding: 4px 8px; font-size: 0.7rem;">
                AM (Owner)
            </button>
            <button onclick="switchUser(2)" style="margin: 2px; padding: 4px 8px; font-size: 0.7rem;">
                SDR (User)
            </button>
            <button onclick="switchUser(3)" style="margin: 2px; padding: 4px 8px; font-size: 0.7rem;">
                CSM (User)
            </button>
            <button onclick="hideDemoSwitcher()" style="margin: 2px; padding: 4px 8px; font-size: 0.7rem; 
                           background: var(--neon-accent); color: white; border: none; border-radius: 3px;">
                Hide
            </button>
        </div>
    `;
    
    document.body.appendChild(switcher);
}

function switchUser(userIndex) {
    if (userIndex >= 0 && userIndex < mockUsers.length) {
        const user = mockUsers[userIndex];
        authenticateUser(user);
        window.CxSE.showNotification(`Switched to ${user.name} (${user.role})`, 'success');
        
        // Refresh the page to reset state
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function hideDemoSwitcher() {
    const switcher = document.getElementById('demo-user-switcher');
    if (switcher) {
        switcher.style.display = 'none';
    }
}

// Make functions global for demo buttons
window.switchUser = switchUser;
window.hideDemoSwitcher = hideDemoSwitcher;

// ===== AUTHENTICATION FUNCTIONS =====
function authenticateUser(user) {
    authState.isAuthenticated = true;
    authState.currentUser = user;
    authState.accessTier = user.accessTier;
    
    // Set session expiration (24 hours)
    const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
    authState.expiresAt = expiresAt;
    
    // Update global user state
    setCurrentUser(user);
    
    // Save to localStorage
    saveAuthData();
    
    // Update UI based on access tier
    updateUIForAccessTier(user.accessTier);
    
    console.log('User authenticated:', user.name, 'Access:', user.accessTier);
}

function setCurrentUser(user) {
    // Update the global user object
    if (window.CxSE && window.CxSE.currentUser) {
        Object.assign(window.CxSE.currentUser, {
            name: user.name,
            role: user.role,
            accessTier: user.accessTier,
            email: user.email
        });
    } else {
        window.currentUser = user;
    }
}

function logout() {
    authState.isAuthenticated = false;
    authState.currentUser = null;
    authState.accessTier = 'User';
    
    clearAuthData();
    
    // Reset UI
    resetUIForLogout();
    
    window.CxSE.showNotification('Logged out successfully', 'info');
    
    // Redirect to login or reload for demo
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// ===== ACCESS TIER MANAGEMENT =====
function updateUIForAccessTier(accessTier) {
    // Show/hide features based on access tier
    if (accessTier === 'Owner') {
        enableOwnerFeatures();
    } else {
        enableUserFeatures();
    }
    
    // Update access tier selector in profile
    const accessSelect = document.getElementById('access-tier');
    if (accessSelect) {
        accessSelect.value = accessTier;
        
        // Disable if user doesn't have permission to change it
        if (accessTier !== 'Owner') {
            accessSelect.disabled = true;
            accessSelect.title = 'Only owners can change access levels';
        }
    }
}

function enableOwnerFeatures() {
    // Add owner-specific features
    addDataUploadOption();
    enableAllIntegrations();
    addAnalyticsAccess();
    
    console.log('Owner features enabled');
}

function enableUserFeatures() {
    // Standard user features
    removeDataUploadOption();
    limitIntegrations();
    limitAnalyticsAccess();
    
    console.log('User features enabled');
}

function addDataUploadOption() {
    // Add upload option to support menu
    const supportDropdown = document.getElementById('support-dropdown');
    if (supportDropdown && !document.getElementById('upload-option')) {
        const uploadLink = document.createElement('a');
        uploadLink.id = 'upload-option';
        uploadLink.href = '#';
        uploadLink.textContent = '📤 Upload Training Data';
        uploadLink.onclick = () => showDataUpload();
        uploadLink.style.color = 'var(--neon-secondary)';
        
        // Insert after uploads link
        const uploadsLink = supportDropdown.querySelector('a[onclick*="uploads"]');
        if (uploadsLink) {
            uploadsLink.parentNode.insertBefore(uploadLink, uploadsLink.nextSibling);
        } else {
            supportDropdown.appendChild(uploadLink);
        }
    }
}

function removeDataUploadOption() {
    const uploadOption = document.getElementById('upload-option');
    if (uploadOption) {
        uploadOption.remove();
    }
}

function showDataUpload() {
    // Create a simple upload modal for owners
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Upload Training Data</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Upload company data to enhance AI scenario generation:</p>
                <div style="margin: 1rem 0;">
                    <input type="file" id="data-upload" accept=".json,.csv,.txt" 
                           style="margin-bottom: 1rem; width: 100%; padding: 0.5rem;">
                    <textarea placeholder="Or paste data here..." 
                              style="width: 100%; height: 100px; padding: 0.5rem; 
                                     background: var(--bg-tertiary); color: var(--text-primary); 
                                     border: 1px solid var(--border-color); border-radius: 5px;">
                    </textarea>
                </div>
                <button onclick="uploadTrainingData()" 
                        style="width: 100%; padding: 1rem; background: var(--neon-secondary); 
                               border: none; border-radius: 5px; color: white; font-weight: bold;">
                    Upload Data
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('show');
}

function uploadTrainingData() {
    // Mock upload functionality
    window.CxSE.showNotification('Training data uploaded successfully!', 'success');
    document.querySelector('.modal-overlay').remove();
    
    // In production, this would:
    // 1. Validate the uploaded data
    // 2. Process and store it securely
    // 3. Update AI scenarios accordingly
}

// Make upload function global
window.uploadTrainingData = uploadTrainingData;

function enableAllIntegrations() {
    // Enable all integration options for owners
    console.log('All integrations enabled for owner');
}

function limitIntegrations() {
    // Limit integrations for regular users
    console.log('Limited integrations for user');
}

function addAnalyticsAccess() {
    // Add advanced analytics for owners
    console.log('Advanced analytics enabled');
}

function limitAnalyticsAccess() {
    // Basic analytics only for users
    console.log('Basic analytics only');
}

// ===== SESSION MANAGEMENT =====
function saveAuthData() {
    try {
        localStorage.setItem('cxse_auth', JSON.stringify(authState));
    } catch (error) {
        console.error('Failed to save auth data:', error);
    }
}

function clearAuthData() {
    localStorage.removeItem('cxse_auth');
}

function resetUIForLogout() {
    // Reset UI to default state
    const accessSelect = document.getElementById('access-tier');
    if (accessSelect) {
        accessSelect.disabled = false;
        accessSelect.value = 'User';
    }
    
    removeDataUploadOption();
}

// ===== API AUTHENTICATION =====
function getAuthHeaders() {
    if (!authState.isAuthenticated) {
        return {};
    }
    
    return {
        'Authorization': `Bearer ${generateSessionToken()}`,
        'X-User-Role': authState.currentUser.role,
        'X-Access-Tier': authState.accessTier
    };
}

function generateSessionToken() {
    // Simple token generation for demo
    // In production, this would be a proper JWT or session token
    return btoa(`${authState.currentUser.id}:${authState.expiresAt}`);
}

// ===== LOGIN SIMULATION =====
function simulateLogin(username, password) {
    const user = mockUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        authenticateUser(user);
        return { success: true, user };
    } else {
        return { success: false, error: 'Invalid credentials' };
    }
}

// ===== ROLE-BASED ACCESS CONTROL =====
function hasPermission(permission) {
    if (!authState.isAuthenticated) return false;
    
    const permissions = {
        'upload_data': authState.accessTier === 'Owner',
        'view_analytics': authState.accessTier === 'Owner',
        'manage_users': authState.accessTier === 'Owner',
        'training_access': true, // All authenticated users
        'basic_features': true
    };
    
    return permissions[permission] || false;
}

function requirePermission(permission, action) {
    if (hasPermission(permission)) {
        action();
    } else {
        window.CxSE.showNotification(
            'You do not have permission to perform this action',
            'error'
        );
    }
}

// ===== SESSION TIMEOUT =====
function checkSessionTimeout() {
    if (authState.isAuthenticated && authState.expiresAt) {
        const now = new Date().getTime();
        const timeLeft = authState.expiresAt - now;
        
        // Warn when 5 minutes left
        if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
            window.CxSE.showNotification(
                'Your session will expire soon. Please save your work.',
                'warning'
            );
        }
        
        // Auto-logout when expired
        if (timeLeft <= 0) {
            window.CxSE.showNotification('Session expired. Please log in again.', 'error');
            logout();
        }
    }
}

// Check session timeout every minute
setInterval(checkSessionTimeout, 60000);

// ===== EXPORTS =====
window.AuthModule = {
    authState,
    authenticateUser,
    logout,
    hasPermission,
    requirePermission,
    getAuthHeaders,
    simulateLogin,
    updateUIForAccessTier
};

// ===== AUTO-AUTHENTICATION CHECK =====
// Ensure user is authenticated when the module loads
if (!authState.isAuthenticated) {
    setTimeout(() => {
        if (!checkAuthenticationStatus()) {
            setupDemoLogin();
        }
    }, 100);
}