// Auth State
const authState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [] // Mock user database
};

// DOM Elements
const authActions = document.querySelector('.auth-actions');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Update UI based on Auth State
function updateAuthUI() {
    if (!authActions) return;

    if (authState.currentUser) {
        authActions.innerHTML = `
            <div class="user-menu" style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 0.9rem; font-weight: 500;">Merhaba, ${authState.currentUser.name}</span>
                <button onclick="logout()" class="btn-text" style="background:none; border:none; cursor:pointer; color: var(--color-danger, red); font-size: 0.9rem;">Çıkış</button>
            </div>
        `;
    } else {
        authActions.innerHTML = `
            <a href="login.html" style="font-weight: 500; font-size: 0.9rem; margin-right: 0.5rem;">Giriş Yap</a>
            <span style="opacity: 0.5;">|</span>
            <a href="register.html" style="font-weight: 500; font-size: 0.9rem; margin-left: 0.5rem;">Üye Ol</a>
        `;
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = authState.users.find(u => u.email === email && u.password === password);

    if (user) {
        // Login Success
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = 'index.html';
    } else {
        alert('E-posta veya şifre hatalı!');
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
    }

    const existingUser = authState.users.find(u => u.email === email);
    if (existingUser) {
        alert('Bu e-posta adresi zaten kayıtlı!');
        return;
    }

    // Register Success
    const newUser = { name: fullname, email, password };
    authState.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(authState.users));

    // Auto login
    localStorage.setItem('currentUser', JSON.stringify({ name: fullname, email }));

    alert('Kayıt başarılı! Yönlendiriliyorsunuz...');
    window.location.href = 'index.html';
}

// Logout
window.logout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
};
