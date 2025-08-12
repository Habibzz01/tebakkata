// script.js - JavaScript utama untuk semua halaman

// Global variables
let currentUser = null;

// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    auth.onAuthStateChanged(function(user) {
        currentUser = user;
        updateAuthUI();
    });
});

// Update authentication UI
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        if (currentUser) {
            authButtons.innerHTML = `
                <span style="color: var(--text-secondary); margin-right: 1rem;">Halo, ${currentUser.displayName || 'User'}!</span>
                <button class="btn btn-error" onclick="logout()">Logout</button>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-primary">Login</a>
                <a href="daftar.html" class="btn btn-secondary">Daftar</a>
            `;
        }
    }
}

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Logout function
function logout() {
    auth.signOut()
        .then(() => {
            showToast('Logout berhasil!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        })
        .catch((error) => {
            showToast('Error: ' + error.message, 'error');
        });
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validate email function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password function
function validatePassword(password) {
    return password.length >= 6;
}

// Generate random ID function
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading spinner function
function showLoading(element) {
    element.innerHTML = '<div class="spinner"></div>';
}

// Hide loading spinner function
function hideLoading(element) {
    element.innerHTML = '';
}

// Error handler function
function handleError(error) {
    console.error('Error:', error);
    showToast('Terjadi kesalahan: ' + error.message, 'error');
}

// Success handler function
function handleSuccess(message) {
    showToast(message, 'success');
}

// Confirm dialog function
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Redirect function
function redirect(url) {
    window.location.href = url;
}

// Get URL parameters function
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Set URL parameter function
function setUrlParameter(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Remove URL parameter function
function removeUrlParameter(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// Local storage functions
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// Session storage functions
function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getFromSessionStorage(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Teks disalin ke clipboard!', 'success');
    }).catch((error) => {
        showToast('Gagal menyalin teks!', 'error');
    });
}

// Download file function
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Print function
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[id$="Modal"]');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    
    // Enter key to submit forms
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' && activeElement.form) {
            activeElement.form.dispatchEvent(new Event('submit'));
        }
    }
});

// Smooth scroll function
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
        }
    });
}, observerOptions);

// Observe elements with animation class
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

// Responsive menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-menu-open');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.nav');
    
    if (navLinks && nav && !nav.contains(e.target) && navLinks.classList.contains('mobile-menu-open')) {
        navLinks.classList.remove('mobile-menu-open');
    }
});

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Clear form
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
}

// Show/hide password
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
    }
}

// File upload preview
function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input && preview && input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 10 + 'px';
            tooltipElement.style.left = rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2 + 'px';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipElement = document.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    loadTheme();
    updateAuthUI();
});