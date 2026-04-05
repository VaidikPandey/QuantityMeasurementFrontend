// dashboard page logic

document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (token) {
        setToken(token);
        setUser({ name, email });
        window.history.replaceState({}, document.title, '/dashboard.html');
    }

    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    setupOperations();
    loadHistoryOptimized();
});

function loadUserInfo() {
    const user = getUser();
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
        document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
    }
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}

function setupOperations() {
    document.getElementById('compare-form')?.addEventListener('submit', handleCompare);
    document.getElementById('add-form')?.addEventListener('submit', handleAdd);
    document.getElementById('subtract-form')?.addEventListener('submit', handleSubtract);
    document.getElementById('divide-form')?.addEventListener('submit', handleDivide);
    document.getElementById('convert-form')?.addEventListener('submit', handleConvert);

    // initialize all unit dropdowns on page load
    ['compare', 'add', 'subtract', 'divide', 'convert'].forEach(op => updateUnits(op));
}

const UNITS = {
    LENGTH: ['FEET', 'INCH', 'YARDS', 'CENTIMETER'],
    WEIGHT: ['KILOGRAM', 'GRAM', 'POUND'],
    VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
    TEMPERATURE: ['CELSIUS', 'FAHRENHEIT']
};

function updateUnits(operation) {
    const type = document.getElementById(`${operation}-type`).value;
    const units = UNITS[type];

    const selects = document.querySelectorAll(
        `[id^="${operation}-unit"], [id="${operation}-from"], [id="${operation}-to"]`
    );

    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = units.map(u =>
            `<option value="${u}">${u.charAt(0) + u.slice(1).toLowerCase()}</option>`
        ).join('');
        if (units.includes(currentVal)) select.value = currentVal;
    });
}

function buildQuantity(value, unit, type) {
    return { value: parseFloat(value), unit, type };
}

function showResult(boxId, value) {
    const box = document.getElementById(boxId);
    const resultValue = box.querySelector('.result-value');
    resultValue.textContent = value;
    resultValue.style.color = 'var(--success)';
    box.classList.add('show');
}

function showError(boxId, message) {
    const box = document.getElementById(boxId);
    const resultValue = box.querySelector('.result-value');
    resultValue.textContent = '❌ ' + message;
    resultValue.style.color = 'var(--error)';
    box.classList.add('show');
}

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

// ================= HANDLERS =================

async function handleCompare(e) {
    e.preventDefault();
    const type = document.getElementById('compare-type').value;
    const q1 = buildQuantity(document.getElementById('compare-value1').value, document.getElementById('compare-unit1').value, type);
    const q2 = buildQuantity(document.getElementById('compare-value2').value, document.getElementById('compare-unit2').value, type);
    setLoading(e.target, true);
    try {
        const result = await compareQuantities(q1, q2);
        showResult('compare-result', result ? '✅ Equal' : '❌ Not Equal');
        loadHistoryOptimized();
    } catch (error) {
        showError('compare-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

async function handleAdd(e) {
    e.preventDefault();
    const type = document.getElementById('add-type').value;
    const q1 = buildQuantity(document.getElementById('add-value1').value, document.getElementById('add-unit1').value, type);
    const q2 = buildQuantity(document.getElementById('add-value2').value, document.getElementById('add-unit2').value, type);
    setLoading(e.target, true);
    try {
        const result = await addQuantities(q1, q2);
        showResult('add-result', `${result.value} ${result.unit}`);
        loadHistoryOptimized();
    } catch (error) {
        showError('add-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

async function handleSubtract(e) {
    e.preventDefault();
    const type = document.getElementById('subtract-type').value;
    const q1 = buildQuantity(document.getElementById('subtract-value1').value, document.getElementById('subtract-unit1').value, type);
    const q2 = buildQuantity(document.getElementById('subtract-value2').value, document.getElementById('subtract-unit2').value, type);
    setLoading(e.target, true);
    try {
        const result = await subtractQuantities(q1, q2);
        showResult('subtract-result', `${result.value} ${result.unit}`);
        loadHistoryOptimized();
    } catch (error) {
        showError('subtract-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

async function handleDivide(e) {
    e.preventDefault();
    const type = document.getElementById('divide-type').value;
    const q1 = buildQuantity(document.getElementById('divide-value1').value, document.getElementById('divide-unit1').value, type);
    const q2 = buildQuantity(document.getElementById('divide-value2').value, document.getElementById('divide-unit2').value, type);
    setLoading(e.target, true);
    try {
        const result = await divideQuantities(q1, q2);
        showResult('divide-result', result);
        loadHistoryOptimized();
    } catch (error) {
        showError('divide-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

async function handleConvert(e) {
    e.preventDefault();
    const type = document.getElementById('convert-type').value;
    const q1 = buildQuantity(document.getElementById('convert-value').value, document.getElementById('convert-from').value, type);
    const targetUnit = document.getElementById('convert-to').value;
    setLoading(e.target, true);
    try {
        const result = await convertQuantity(q1, targetUnit);
        showResult('convert-result', `${result.value} ${result.unit}`);
        loadHistoryOptimized();
    } catch (error) {
        showError('convert-result', error.message);
    } finally {
        setLoading(e.target, false);
    }
}

// ================= HISTORY =================

async function loadHistoryOptimized() {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;

    try {
        let allHistory = await getMyHistory();

        if (!allHistory || allHistory.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center; padding:24px;">
                        No history yet. Try an operation!
                    </td>
                </tr>`;
            return;
        }

        allHistory = allHistory.slice(0, 10);

        tbody.innerHTML = allHistory.map(item => `
            <tr>
                <td><span class="badge badge-success">${item.operation}</span></td>
                <td>${item.measurementType}</td>
                <td>${item.result || item.message || '-'}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('History error:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:24px;">
                    Failed to load history
                </td>
            </tr>`;
    }
}

async function clearHistory() {
    if (!confirm('Are you sure you want to clear your history?')) return;
    try {
        await clearMyHistory();
        loadHistoryOptimized();
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}