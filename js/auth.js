// auth page logic

document.addEventListener('DOMContentLoaded', () => {

    // redirect to dashboard if already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    setupTabs();
    setupForms();
});

// tab switching between login and register
function setupTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // show correct form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(target).classList.add('active');

            // clear alerts
            clearAlerts();
        });
    });
}

// setup form submissions
function setupForms() {
    // login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    if (!email || !password) {
        showAlert('login-alert', 'Please fill in all fields', 'error');
        return;
    }

    setLoading(btn, true);

    try {
        const response = await loginUser(email, password);
        setToken(response.token);
        setUser({ email: response.email, name: response.name });
        showAlert('login-alert', 'Login successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showAlert('login-alert', error.message, 'error');
    } finally {
        setLoading(btn, false);
    }
}

// handle register
async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const name = document.getElementById('register-name').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const btn = document.getElementById('register-btn');

    if (!email || !name || !password || !confirmPassword) {
        showAlert('register-alert', 'Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('register-alert', 'Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('register-alert', 'Password must be at least 6 characters', 'error');
        return;
    }

    setLoading(btn, true);

    try {
        const response = await registerUser(email, name, password);
        setToken(response.token);
        setUser({ email: response.email, name: response.name });
        showAlert('register-alert', 'Registration successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showAlert('register-alert', error.message, 'error');
    } finally {
        setLoading(btn, false);
    }
}

// show alert message
function showAlert(id, message, type) {
    const alert = document.getElementById(id);
    if (alert) {
        alert.textContent = message;
        alert.className = `alert alert-${type} show`;
    }
}

// clear all alerts
function clearAlerts() {
    document.querySelectorAll('.alert').forEach(alert => {
        alert.classList.remove('show');
    });
}

// set button loading state
function setLoading(btn, loading) {
    if (loading) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Please wait...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.text || 'Submit';
    }
}