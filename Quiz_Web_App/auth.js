// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;
        
        try {
            // In a real application, you would make an API call here
            // For demo purposes, we'll use localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store user session
                const sessionData = {
                    email: user.email,
                    name: user.fullname,
                    timestamp: new Date().getTime()
                };
                
                if (remember) {
                    localStorage.setItem('user', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(sessionData));
                }
                
                // Redirect to quiz
                window.location.href = 'index.html';
            } else {
                showError(loginForm, 'Invalid email or password');
            }
        } catch (error) {
            showError(loginForm, 'An error occurred. Please try again.');
        }
    });
}

// Handle signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showError(signupForm, 'Passwords do not match');
            return;
        }
        
        try {
            // In a real application, you would make an API call here
            // For demo purposes, we'll use localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                showError(signupForm, 'Email already registered');
                return;
            }
            
            // Add new user
            users.push({
                fullname,
                email,
                password // In a real app, this should be hashed
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message and redirect
            showSuccess(signupForm, 'Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            showError(signupForm, 'An error occurred. Please try again.');
        }
    });
}

// Show error message
function showError(form, message) {
    // Remove any existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.querySelector('button'));
}

// Show success message
function showSuccess(form, message) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.querySelector('button'));
}

// Add password strength validation
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let strength = 0;
        
        // Check password strength
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        // Update password strength indicator
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        let strengthText = '';
        let strengthColor = '';
        
        switch (strength) {
            case 0:
            case 1:
                strengthText = 'Very Weak';
                strengthColor = '#e74c3c';
                break;
            case 2:
                strengthText = 'Weak';
                strengthColor = '#e67e22';
                break;
            case 3:
                strengthText = 'Medium';
                strengthColor = '#f1c40f';
                break;
            case 4:
                strengthText = 'Strong';
                strengthColor = '#2ecc71';
                break;
            case 5:
                strengthText = 'Very Strong';
                strengthColor = '#27ae60';
                break;
        }
        
        strengthIndicator.style.color = strengthColor;
        strengthIndicator.textContent = `Password Strength: ${strengthText}`;
        
        // Remove existing indicator if any
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        passwordInput.parentNode.appendChild(strengthIndicator);
    });
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', checkAuth); 