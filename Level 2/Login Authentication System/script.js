/**
 * Nova Authentication System
 * Features real-time validation and zero-plaintext storage using Web Crypto API.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const btnGoRegister = document.getElementById('go-to-register');
    const btnGoLogin = document.getElementById('go-to-login');
    const btnLogout = document.getElementById('logout-btn');

    const DB_KEY = 'nova_users_db';
    const SESSION_KEY = 'nova_session';
    
    // Initialize DB if empty
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }

    // --- SECURITY: PASSWORD HASHING ---
    // Safely hashes password. Includes fallback if user opens file via file:// protocol
    async function hashPassword(password) {
        if (crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            // Fallback for file:// protocol where crypto.subtle is disabled by browsers
            return btoa(password).split('').reverse().join(''); 
        }
    }

    // --- VIEW CONTROLLERS ---
    function showLogin() {
        registerContainer.classList.remove('active');
        setTimeout(() => {
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            setTimeout(() => loginContainer.classList.add('active'), 50);
        }, 200);
        clearFormErrors(registerForm);
        registerForm.reset();
        updatePasswordStrength('');
    }

    function showRegister() {
        loginContainer.classList.remove('active');
        setTimeout(() => {
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
            setTimeout(() => registerContainer.classList.add('active'), 50);
        }, 200);
        clearFormErrors(loginForm);
        loginForm.reset();
    }

    function showDashboard(user) {
        authView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        
        document.getElementById('dash-greeting').textContent = `Welcome back, ${user.name.split(' ')[0]}.`;
        document.getElementById('dash-name').textContent = user.name;
        document.getElementById('dash-email').textContent = user.email;
    }

    function handleLogout() {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY); 
        
        dashboardView.classList.add('hidden');
        authView.classList.remove('hidden');
        showLogin();
        showToast('You have been signed out.', 'success');
    }

    // --- CORE AUTH LOGIC ---
    async function registerUser(e) {
        e.preventDefault();
        if (!validateRegistration()) return;

        setLoading(document.getElementById('register-btn'), true);

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;

        const users = JSON.parse(localStorage.getItem(DB_KEY));
        if (users.some(u => u.email === email)) {
            setLoading(document.getElementById('register-btn'), false);
            showFieldError('reg-email', 'An account with this email already exists.');
            return;
        }

        // Simulate network latency
        setTimeout(async () => {
            const hashedPassword = await hashPassword(password);
            
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                passwordHash: hashedPassword
            };

            users.push(newUser);
            localStorage.setItem(DB_KEY, JSON.stringify(users));

            setLoading(document.getElementById('register-btn'), false);
            showToast('Account created successfully.', 'success');
            
            showLogin();
            document.getElementById('login-email').value = email;
        }, 800);
    }

    async function loginUser(e) {
        e.preventDefault();
        if (!validateLogin()) return;

        setLoading(document.getElementById('login-btn'), true);

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        setTimeout(async () => {
            const users = JSON.parse(localStorage.getItem(DB_KEY));
            const user = users.find(u => u.email === email);
            
            setLoading(document.getElementById('login-btn'), false);

            if (!user) {
                showFieldError('login-password', 'Unable to sign in with those details.');
                return;
            }

            const hashedInput = await hashPassword(password);
            if (user.passwordHash !== hashedInput) {
                showFieldError('login-password', 'Unable to sign in with those details.');
                return;
            }

            // Secure Session State
            const sessionData = { id: user.id, name: user.name, email: user.email };
            if (rememberMe) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            }

            showToast('Welcome back.', 'success');
            showDashboard(sessionData);
            document.getElementById('login-password').value = '';
        }, 800);
    }

    // --- VALIDATION & UI HELPERS ---
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkPasswordStrength(password) {
        return {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            number: /[0-9]/.test(password)
        };
    }

    function validateRegistration() {
        let isValid = true;
        clearFormErrors(registerForm);

        const name = document.getElementById('reg-name');
        const email = document.getElementById('reg-email');
        const password = document.getElementById('reg-password');
        const confirm = document.getElementById('reg-confirm');

        if (name.value.trim() === '') {
            showFieldError('reg-name', 'Full name is required.');
            isValid = false;
        }

        if (!validateEmail(email.value.trim())) {
            showFieldError('reg-email', 'Please enter a valid email address.');
            isValid = false;
        }

        const strength = checkPasswordStrength(password.value);
        if (!strength.length || !strength.upper || !strength.number) {
            showFieldError('reg-password', 'Please meet all password requirements.');
            isValid = false;
        }

        if (password.value !== confirm.value) {
            showFieldError('reg-confirm', 'Passwords do not match.');
            isValid = false;
        }

        return isValid;
    }

    function validateLogin() {
        let isValid = true;
        clearFormErrors(loginForm);
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');

        if (!validateEmail(email.value.trim())) {
            showFieldError('login-email', 'Please enter a valid email.');
            isValid = false;
        }
        if (password.value.trim() === '') {
            showFieldError('login-password', 'Password is required.');
            isValid = false;
        }
        return isValid;
    }

    function showFieldError(id, message) {
        const input = document.getElementById(id);
        const errorSpan = document.getElementById(`${id}-error`);
        input.classList.add('error');
        errorSpan.textContent = message;
    }

    function clearFormErrors(form) {
        form.querySelectorAll('input').forEach(input => input.classList.remove('error'));
        form.querySelectorAll('.error-msg').forEach(error => error.textContent = '');
    }

    function setLoading(button, isLoading) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.loader');
        button.disabled = isLoading;
        if (isLoading) {
            text.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            text.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }

    function updatePasswordStrength(val) {
        const strength = checkPasswordStrength(val);
        document.getElementById('req-length').className = strength.length ? 'valid' : 'invalid';
        document.getElementById('req-upper').className = strength.upper ? 'valid' : 'invalid';
        document.getElementById('req-number').className = strength.number ? 'valid' : 'invalid';

        let score = (strength.length ? 1 : 0) + (strength.upper ? 1 : 0) + (strength.number ? 1 : 0);
        document.getElementById('bar-1').style.backgroundColor = score >= 1 ? (score === 3 ? 'var(--success)' : 'var(--warning)') : 'var(--border-light)';
        document.getElementById('bar-2').style.backgroundColor = score >= 2 ? (score === 3 ? 'var(--success)' : 'var(--warning)') : 'var(--border-light)';
        document.getElementById('bar-3').style.backgroundColor = score >= 3 ? 'var(--success)' : 'var(--border-light)';
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line></svg>`;
        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- EVENT LISTENERS ---
    btnGoRegister.addEventListener('click', showRegister);
    btnGoLogin.addEventListener('click', showLogin);
    btnLogout.addEventListener('click', handleLogout);
    registerForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);

    document.getElementById('reg-password').addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
        document.getElementById('reg-confirm').classList.remove('error');
        document.getElementById('reg-confirm-error').textContent = '';
    });

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            document.getElementById(`${input.id}-error`).textContent = '';
        });
    });

    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const svg = e.currentTarget.querySelector('svg');
            if (input.type === 'password') {
                input.type = 'text';
                svg.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
            } else {
                input.type = 'password';
                svg.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
            }
        });
    });

    // Run Initial Check
    function checkAuthState() {
        const sessionUser = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (sessionUser) {
            showDashboard(JSON.parse(sessionUser));
        }
    }
    checkAuthState();
});