// all API calls to Spring Boot

async function apiCall(endpoint, method = 'GET', body = null) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(CONFIG.BASE_URL + endpoint, options);

    if (response.status === 302 || response.status === 401 || response.status === 403) {
        removeToken();
        window.location.href = 'index.html';
        return;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// auth calls
async function registerUser(email, name, password) {
    return await apiCall(CONFIG.ENDPOINTS.REGISTER, 'POST', { email, name, password });
}

async function loginUser(email, password) {
    return await apiCall(CONFIG.ENDPOINTS.LOGIN, 'POST', { email, password });
}

// measurement calls
async function compareQuantities(q1, q2) {
    return await apiCall(CONFIG.ENDPOINTS.COMPARE, 'POST', { q1, q2 });
}

async function addQuantities(q1, q2) {
    return await apiCall(CONFIG.ENDPOINTS.ADD, 'POST', { q1, q2 });
}

async function subtractQuantities(q1, q2) {
    return await apiCall(CONFIG.ENDPOINTS.SUBTRACT, 'POST', { q1, q2 });
}

async function divideQuantities(q1, q2) {
    return await apiCall(CONFIG.ENDPOINTS.DIVIDE, 'POST', { q1, q2 });
}

async function convertQuantity(q1, targetUnit) {
    return await apiCall(CONFIG.ENDPOINTS.CONVERT, 'POST', { q1, targetUnit });
}

async function getHistory(operation) {
    return await apiCall(`${CONFIG.ENDPOINTS.HISTORY}/${operation}`, 'GET');
}

// get current user's history only
async function getMyHistory() {
    return await apiCall(CONFIG.ENDPOINTS.MY_HISTORY, 'GET');
}

// clear current user's history
async function clearMyHistory() {
    return await apiCall(CONFIG.ENDPOINTS.CLEAR_HISTORY, 'DELETE');
}