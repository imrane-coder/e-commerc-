// Admin Authentication System
class AdminAuth {
    constructor() {
        this.adminCredentials = {
            email: 'admin@shop.com',
            password: 'admin123'
        };
        this.sessionKey = 'admin_session_active';
        this.init();
    }

    init() {
        // Check if we're on login page
        if (window.location.pathname.includes('admin-login.html')) {
            this.initLoginPage();
        } else {
            this.checkSession();
        }
    }

    initLoginPage() {
        const loginForm = document.getElementById('admin-login-form');
        const passwordToggle = document.getElementById('password-toggle');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }

        // Auto-fill demo credentials
        document.getElementById('admin-email').value = this.adminCredentials.email;
        document.getElementById('admin-password').value = this.adminCredentials.password;
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        // Clear previous errors
        errorDiv.style.display = 'none';

        // Validate credentials
        if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
            // Set session
            localStorage.setItem(this.sessionKey, 'true');
            localStorage.setItem('admin_login_time', new Date().toISOString());
            
            // Redirect to dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            this.showError('Invalid email or password. Please try again.');
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('admin-password');
        const toggleIcon = document.querySelector('#password-toggle i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            toggleIcon.setAttribute('data-lucide', 'eye');
        }
        
        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    checkSession() {
        const isLoggedIn = localStorage.getItem(this.sessionKey) === 'true';
        
        if (!isLoggedIn) {
            // Redirect to login page
            window.location.href = 'admin-login.html';
            return false;
        }
        
        return true;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('admin_login_time');
        window.location.href = 'admin-login.html';
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.innerHTML = `<p>${message}</p>`;
        errorDiv.style.display = 'block';
    }

    isAuthenticated() {
        return localStorage.getItem(this.sessionKey) === 'true';
    }
}

// Global logout function
function logout() {
    const auth = new AdminAuth();
    auth.logout();
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    new AdminAuth();
});

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});