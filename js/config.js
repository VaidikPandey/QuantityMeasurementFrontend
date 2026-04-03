// API Configuration
const CONFIG = {
    // Point to your backend (currently running on port 8080)
    BASE_URL: 'https://quantitymeasurementapp-production-7653.up.railway.app',
    ENDPOINTS: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        GOOGLE_LOGIN: '/oauth2/authorization/google',
        COMPARE: '/api/v1/quantities/compare',
        ADD: '/api/v1/quantities/add',
        SUBTRACT: '/api/v1/quantities/subtract',
        DIVIDE: '/api/v1/quantities/divide',
        CONVERT: '/api/v1/quantities/convert',
        HISTORY: '/api/v1/quantities/history/operation',
    }
};

// Theme Management
const THEME_KEY = 'qma_theme';

function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
}

function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const current = getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Token Management
function getToken() {
    return localStorage.getItem('qma_token');
}

function setToken(token) {
    localStorage.setItem('qma_token', token);
}

function removeToken() {
    localStorage.removeItem('qma_token');
    localStorage.removeItem('qma_user');
}

function getUser() {
    const user = localStorage.getItem('qma_user');
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    localStorage.setItem('qma_user', JSON.stringify(user));
}

function isLoggedIn() {
    return getToken() !== null;
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme());
    updateThemeIcon(getTheme());
});
