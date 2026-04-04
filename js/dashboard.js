// dashboard page logic

document.addEventListener('DOMContentLoaded', () => {

    // check if coming from Google login
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (token) {
        // save token and user from URL params
        setToken(token);
        setUser({ name, email });
        // clean URL
        window.history.replaceState({}, document.title, '/dashboard.html');
    }

    // redirect to login if not logged in
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    setupOperations();
    loadHistory();
});

// load user info in navbar
function loadUserInfo() {
    const user = getUser();
    if (user) {
        const nameEl = document.getElementById('user-name');
        const avatarEl = document.getElementById('user-avatar');
        const welcomeEl = document.getElementById('welcome-name');

        if (nameEl) nameEl.textContent = user.name;
        if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
        if (welcomeEl) welcomeEl.textContent = user.name.split(' ')[0];
    }
}

// logout
function logout() {
    removeToken();
    window.location.href = 'index.html';
}

// setup all operation forms
function setupOperations() {
    document.getElementById('compare-form')
        ?.addEventListener('submit', handleCompare);
    document.getElementById('add-form')
        ?.addEventListener('submit', handleAdd);
    document.getElementById('subtract-form')
        ?.addEventListener('submit', handleSubtract);
    document.getElementById('divide-form')
        ?.addEventListener('submit', handleDivide);
    document.getElementById('convert-form')
        ?.addEventListener('submit', handleConvert);
}

// units for each measurement type
const UNITS = {
    LENGTH: ['FEET', 'INCH', 'YARDS', 'CENTIMETER'],
    WEIGHT: ['KILOGRAM', 'GRAM', 'POUND'],
    VOLUME: ['LITRE', 'MILLILITRE', 'GALLON']
};

// update unit dropdowns when type changes
function updateUnits(operation) {
    const type = document.getElementById(`${operation}-type`).value;
    const units = UNITS[type];

    // find all unit selects for this operation
    const selects = document.querySelectorAll(`[id^="${operation}-unit"], [id="${operation}-from"], [id="${operation}-to"]`);

    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = units.map(u =>
            `<option value="${u}">${u.charAt(0) + u.slice(1).toLowerCase()}</option>`
        ).join('');
        // keep current value if still valid
        if (units.includes(currentVal)) select.value = currentVal;
    });
}

// build quantity object
function buildQuantity(value, unit, type) {
    return { value: parseFloat(value), unit: unit, type: type };
}

// show result
function showResult(boxId, value) {
    const box = document.getElementById(boxId);
    if (box) {
        const resultValue = box.querySelector('.result-value');
        resultValue.textContent = value;
        resultValue.style.color = 'var(--success)';
        box.classList.add('show');
    }
}

// show error
function showError(boxId, message) {
    const box = document.getElementById(boxId);
    if (box) {
        const resultValue = box.querySelector('.result-value');
        resultValue.textContent = '❌ ' + message;
        resultValue.style.color = 'var(--error)';
        box.classList.add('show');
    }
}

// set button loading state
function setLoading(form, loading) {
    const btn = form.querySelector('button[type="submit"]');
    if (loading) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Loading...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.text || 'Submit';
    }
}

// handle compare
async function handleCompare(e) {
    e.preventDefault();
    const type = document.getElementById('compare-type').value;
    const q1 = buildQuantity(
        document.getElementById('compare-value1').value,
        document.getElementById('compare-unit1').value,
        type
    );
    const q2 = buildQuantity(
        document.getElementById('compare-value2').value,
        document.getElementById('compare-unit2').value,
        type
    );

    setLoading(e.target, true);
    try {
        const result = await compareQuantities(q1, q2);
        showResult('compare-result', result ? '✅ Equal' : '❌ Not Equal');
        loadHistory();
    } catch (error) {
        showError('compare-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// handle add
async function handleAdd(e) {
    e.preventDefault();
    const type = document.getElementById('compare-type').value;
    const q1 = buildQuantity(
        document.getElementById('compare-value1').value,
        document.getElementById('compare-unit1').value,
        type
    );
    const q2 = buildQuantity(
        document.getElementById('compare-value2').value,
        document.getElementById('compare-unit2').value,
        type
    );

    setLoading(e.target, true);
    try {
        const result = await addQuantities(q1, q2);
        showResult('add-result', `${result.value} ${result.unit}`);
        loadHistory();
    } catch (error) {
        showError('add-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// handle subtract
async function handleSubtract(e) {
    e.preventDefault();
    const type = document.getElementById('compare-type').value;
    const q1 = buildQuantity(
        document.getElementById('compare-value1').value,
        document.getElementById('compare-unit1').value,
        type
    );
    const q2 = buildQuantity(
        document.getElementById('compare-value2').value,
        document.getElementById('compare-unit2').value,
        type
    );

    setLoading(e.target, true);
    try {
        const result = await subtractQuantities(q1, q2);
        showResult('subtract-result', `${result.value} ${result.unit}`);
        loadHistory();
    } catch (error) {
        showError('subtract-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// handle divide
async function handleDivide(e) {
    e.preventDefault();
    const type = document.getElementById('compare-type').value;
    const q1 = buildQuantity(
        document.getElementById('compare-value1').value,
        document.getElementById('compare-unit1').value,
        type
    );
    const q2 = buildQuantity(
        document.getElementById('compare-value2').value,
        document.getElementById('compare-unit2').value,
        type
    );

    setLoading(e.target, true);
    try {
        const result = await divideQuantities(q1, q2);
        showResult('divide-result', result);
        loadHistory();
    } catch (error) {
        showError('divide-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// handle convert
async function handleConvert(e) {
    e.preventDefault();
    const type = document.getElementById('convert-type').value;
    const q1 = buildQuantity(
        document.getElementById('convert-value').value,
        document.getElementById('convert-from').value,
        type
    );
    const targetUnit = document.getElementById('convert-to').value;

    setLoading(e.target, true);
    try {
        const result = await convertQuantity(q1, targetUnit);
        showResult('convert-result', `${result.value} ${result.unit}`);
        loadHistory();
    } catch (error) {
        showError('convert-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// load history table
async function loadHistory() {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;

    try {
        const operations = ['COMPARE', 'ADD', 'SUBTRACT', 'DIVIDE', 'CONVERT'];
        let allHistory = [];

        for (const op of operations) {
            const history = await getHistory(op);
            if (history && history.length > 0) {
                allHistory = [...allHistory, ...history];
            }
        }

        // sort newest first
        allHistory.sort((a, b) => b.id - a.id);

        // take last 10
        allHistory = allHistory.slice(0, 10);

        if (allHistory.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;
                        color: var(--text-muted); padding: 24px;">
                        No history yet. Try an operation!
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = allHistory.map(item => `
            <tr>
                <td>
                    <span class="badge badge-success">
                        ${item.operation}
                    </span>
                </td>
                <td>${item.measurementType}</td>
                <td>${item.result || item.message || '-'}</td>
                <td>${new Date(item.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Failed to load history:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;
                    color: var(--error); padding: 24px;">
                    Failed to load history. Make sure you are logged in.
                </td>
            </tr>`;
    }
}