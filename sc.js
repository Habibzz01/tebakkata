// Global variables
let currentUser = null;
let gameWords = [];
let currentWord = '';
let guessedLetters = [];
let attempts = 0;
let maxAttempts = 6;
let currentQuestionId = null;
let isGameActive = false;
let gameStartTime = 0;
let gameDuration = 0;
let leaderboardData = [];

// DOM Elements
const elements = {
  // Theme toggle
  themeToggle: null,
  
  // Auth elements
  authForm: null,
  authTypeTabs: null,
  googleSignInBtn: null,
  emailSignInBtn: null,
  registerBtn: null,
  forgotPasswordBtn: null,
  authError: null,
  
  // Game elements
  wordDisplay: null,
  keyboard: null,
  attemptsDisplay: null,
  scoreDisplay: null,
  hintElement: null,
  startGameBtn: null,
  nextWordBtn: null,
  gameResult: null,
  gameResultMessage: null,
  
  // Leaderboard elements
  leaderboardTable: null,
  
  // Profile elements
  usernameInput: null,
  saveProfileBtn: null,
  changePasswordBtn: null,
  deleteAccountBtn: null,
  logoutBtn: null,
  currentUsername: null,
  
  // Question management elements
  questionForm: null,
  wordInput: null,
  hintInput: null,
  saveQuestionBtn: null,
  questionsList: null
};

// Initialize the app
function initApp() {
  // Initialize DOM elements
  initDOMElements();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check theme preference
  checkThemePreference();
  
  // Load initial data
  loadInitialData();
  
  // Initialize Firebase
  initializeFirebase();
}

// Initialize DOM elements
function initDOMElements() {
  // Theme toggle
  elements.themeToggle = document.querySelector('.theme-toggle');
  
  // Auth elements
  elements.authForm = document.getElementById('auth-form');
  elements.authTypeTabs = document.querySelectorAll('.auth-option');
  elements.googleSignInBtn = document.getElementById('google-signin');
  elements.emailSignInBtn = document.getElementById('email-signin');
  elements.registerBtn = document.getElementById('register-btn');
  elements.forgotPasswordBtn = document.getElementById('forgot-password');
  elements.authError = document.getElementById('auth-error');
  
  // Game elements
  elements.wordDisplay = document.getElementById('word-display');
  elements.keyboard = document.getElementById('keyboard');
  elements.attemptsDisplay = document.getElementById('attempts');
  elements.scoreDisplay = document.getElementById('score');
  elements.hintElement = document.getElementById('hint');
  elements.startGameBtn = document.getElementById('start-game');
  elements.nextWordBtn = document.getElementById('next-word');
  elements.gameResult = document.getElementById('game-result');
  elements.gameResultMessage = document.getElementById('game-result-message');
  
  // Leaderboard elements
  elements.leaderboardTable = document.getElementById('leaderboard-table');
  
  // Profile elements
  elements.usernameInput = document.getElementById('username');
  elements.saveProfileBtn = document.getElementById('save-profile');
  elements.changePasswordBtn = document.getElementById('change-password');
  elements.deleteAccountBtn = document.getElementById('delete-account');
  elements.logoutBtn = document.getElementById('logout');
  elements.currentUsername = document.getElementById('current-username');
  
  // Question management elements
  elements.questionForm = document.getElementById('question-form');
  elements.wordInput = document.getElementById('word');
  elements.hintInput = document.getElementById('hint');
  elements.saveQuestionBtn = document.getElementById('save-question');
  elements.questionsList = document.getElementById('questions-list');
}

// Setup all event listeners
function setupEventListeners() {
  // Theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Auth event listeners
  if (elements.authTypeTabs) {
    elements.authTypeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelector('.auth-option.active').classList.remove('active');
        tab.classList.add('active');
        
        if (tab.dataset.type === 'login') {
          document.getElementById('auth-title').textContent = 'Masuk ke Akun Anda';
          document.getElementById('submit-auth').textContent = 'Masuk';
          document.getElementById('auth-form').dataset.type = 'login';
        } else {
          document.getElementById('auth-title').textContent = 'Buat Akun Baru';
          document.getElementById('submit-auth').textContent = 'Daftar';
          document.getElementById('auth-form').dataset.type = 'register';
        }
      });
    });
  }
  
  if (elements.googleSignInBtn) {
    elements.googleSignInBtn.addEventListener('click', signInWithGoogle);
  }
  
  if (elements.emailSignInBtn) {
    elements.emailSignInBtn.addEventListener('click', handleEmailAuth);
  }
  
  if (elements.registerBtn) {
    elements.registerBtn.addEventListener('click', () => {
      window.location.href = 'daftar.html';
    });
  }
  
  if (elements.forgotPasswordBtn) {
    elements.forgotPasswordBtn.addEventListener('click', () => {
      window.location.href = 'lupasandi.html';
    });
  }
  
  // Game event listeners
  if (elements.startGameBtn) {
    elements.startGameBtn.addEventListener('click', startGame);
  }
  
  if (elements.nextWordBtn) {
    elements.nextWordBtn.addEventListener('click', startGame);
  }
  
  // Profile event listeners
  if (elements.saveProfileBtn) {
    elements.saveProfileBtn.addEventListener('click', updateProfile);
  }
  
  if (elements.changePasswordBtn) {
    elements.changePasswordBtn.addEventListener('click', showChangePasswordModal);
  }
  
  if (elements.deleteAccountBtn) {
    elements.deleteAccountBtn.addEventListener('click', confirmDeleteAccount);
  }
  
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', logout);
  }
  
  // Question management event listeners
  if (elements.questionForm) {
    elements.questionForm.addEventListener('submit', saveQuestion);
  }
  
  if (elements.saveQuestionBtn) {
    elements.saveQuestionBtn.addEventListener('click', saveQuestion);
  }
}

// Check and apply theme preference
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme;
  
  if (currentTheme === 'dark') {
    newTheme = 'light';
  } else {
    newTheme = 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load initial data based on page
function loadInitialData() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  switch (page) {
    case 'index.html':
      loadHomePage();
      break;
    case 'dashboard.html':
      loadDashboard();
      break;
    case 'profile.html':
      loadProfilePage();
      break;
    case 'tambahsoal.html':
      loadQuestionManagement();
      break;
    case 'lupasandi.html':
      setupPasswordReset();
      break;
  }
}

// Load home page data
function loadHomePage() {
  if (currentUser) {
    // User is logged in, redirect to dashboard
    window.location.href = 'dashboard.html';
  } else {
    // Show login options
    showElement(document.querySelector('.auth-options'));
  }
}

// Load dashboard data
function loadDashboard() {
  if (!currentUser) {
    // User not logged in, redirect to login
    window.location.href = 'login.html';
    return;
  }
  
  // Load user data
  loadUserData();
  
  // Load game data
  loadGameWords();
  
  // Load leaderboard
  loadLeaderboard();
}

// Load profile page
function loadProfilePage() {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // Load user data
  loadUserData();
}

// Load question management page
function loadQuestionManagement() {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // Load questions
  loadQuestions();
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
  const authElements = document.querySelectorAll('[data-auth="auth"]');
  const nonAuthElements = document.querySelectorAll('[data-auth="non-auth"]');
  
  authElements.forEach(el => showElement(el));
  nonAuthElements.forEach(el => hideElement(el));
  
  // Update user-specific content
  if (currentUser && elements.currentUsername) {
    elements.currentUsername.textContent = currentUser.displayName || currentUser.email;
  }
  
  // Redirect if on auth pages
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  if (page === 'login.html' || page === 'daftar.html') {
    window.location.href = 'dashboard.html';
  }
}

// Update UI for non-authenticated user
function updateUIForNonAuthenticatedUser() {
  const authElements = document.querySelectorAll('[data-auth="auth"]');
  const nonAuthElements = document.querySelectorAll('[data-auth="non-auth"]');
  
  authElements.forEach(el => hideElement(el));
  nonAuthElements.forEach(el => showElement(el));
  
  // Redirect if on protected pages
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  const protectedPages = ['dashboard.html', 'profile.html', 'tambahsoal.html'];
  
  if (protectedPages.includes(page)) {
    window.location.href = 'login.html';
  }
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  showLoading(elements.googleSignInBtn);
  
  firebase.auth().signInWithPopup(provider)
    .catch((error) => {
      hideLoading(elements.googleSignInBtn);
      showAuthError(error.message);
    });
}

// Handle email/password authentication
function handleEmailAuth(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const authType = elements.authForm.dataset.type;
  
  if (!validateEmail(email)) {
    showAuthError('Format email tidak valid');
    return;
  }
  
  if (password.length < 6) {
    showAuthError('Password harus minimal 6 karakter');
    return;
  }
  
  showLoading(elements.emailSignInBtn);
  
  if (authType === 'login') {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        hideLoading(elements.emailSignInBtn);
        showAuthError(getAuthErrorMessage(error.code));
      });
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Update profile with email as displayName
        return userCredential.user.updateProfile({
          displayName: email.split('@')[0]
        });
      })
      .catch((error) => {
        hideLoading(elements.emailSignInBtn);
        showAuthError(getAuthErrorMessage(error.code));
      });
  }
}

// Forgot password functionality
function setupPasswordReset() {
  const form = document.getElementById('reset-password-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-email').value;
      
      if (!validateEmail(email)) {
        showAuthError('Format email tidak valid');
        return;
      }
      
      showLoading(document.getElementById('reset-submit'));
      
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          hideLoading(document.getElementById('reset-submit'));
          showSuccessMessage('Email reset password telah dikirim. Silakan periksa kotak masuk Anda.');
          document.getElementById('reset-email').value = '';
        })
        .catch((error) => {
          hideLoading(document.getElementById('reset-submit'));
          showAuthError(getAuthErrorMessage(error.code));
        });
    });
  }
}

// Get meaningful error message from Firebase auth error code
function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan';
    case 'auth/user-not-found':
      return 'Email tidak ditemukan';
    case 'auth/wrong-password':
      return 'Password salah';
    case 'auth/email-already-in-use':
      return 'Email sudah digunakan oleh akun lain';
    case 'auth/weak-password':
      return 'Password terlalu lemah (minimal 6 karakter)';
    case 'auth/operation-not-allowed':
      return 'Operasi tidak diizinkan';
    case 'auth/invalid-credential':
      return 'Kredensial tidak valid';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi.';
  }
}

// Show auth error message
function showAuthError(message) {
  if (elements.authError) {
    elements.authError.textContent = message;
    elements.authError.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      elements.authError.style.display = 'none';
    }, 5000);
  }
}

// Show success message
function showSuccessMessage(message) {
  const toast = createToast(message, 'success');
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Create toast notification
function createToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = message;
  return toast;
}

// Show loading indicator on button
function showLoading(button) {
  if (!button) return;
  
  const originalText = button.innerHTML;
  button.innerHTML = `<span class="loading"></span> Memuat...`;
  button.disabled = true;
  button.dataset.originalText = originalText;
}

// Hide loading indicator on button
function hideLoading(button) {
  if (!button || !button.disabled) return;
  
  button.innerHTML = button.dataset.originalText;
  button.disabled = false;
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Load user data from Firebase
function loadUserData() {
  if (!currentUser) return;
  
  firebaseHelper.getUserData(currentUser.uid)
    .then(snapshot => {
      const userData = snapshot.val() || {};
      
      // Update profile fields
      if (elements.usernameInput && userData.username) {
        elements.usernameInput.value = userData.username;
      }
      
      if (elements.currentUsername && userData.username) {
        elements.currentUsername.textContent = userData.username;
      }
    })
    .catch(error => {
      console.error('Error loading user data:', error);
    });
}

// Update user profile
function updateProfile() {
  if (!currentUser) return;
  
  const username = elements.usernameInput.value.trim();
  
  if (!username) {
    showAuthError('Nama pengguna tidak boleh kosong');
    return;
  }
  
  showLoading(elements.saveProfileBtn);
  
  // Update in Firebase
  firebaseHelper.saveUserData(currentUser.uid, {
    username: username,
    updatedAt: Date.now()
  })
  .then(() => {
    // Update current user display name
    return currentUser.updateProfile({
      displayName: username
    });
  })
  .then(() => {
    hideLoading(elements.saveProfileBtn);
    showSuccessMessage('Profil berhasil diperbarui');
    
    // Update UI
    if (elements.currentUsername) {
      elements.currentUsername.textContent = username;
    }
  })
  .catch(error => {
    hideLoading(elements.saveProfileBtn);
    showAuthError('Gagal memperbarui profil: ' + error.message);
  });
}

// Show change password modal
function showChangePasswordModal() {
  const newPassword = prompt('Masukkan password baru (minimal 6 karakter):');
  
  if (!newPassword) return;
  
  if (newPassword.length < 6) {
    alert('Password harus minimal 6 karakter');
    return;
  }
  
  showLoading(elements.changePasswordBtn);
  
  currentUser.updatePassword(newPassword)
    .then(() => {
      hideLoading(elements.changePasswordBtn);
      showSuccessMessage('Password berhasil diubah');
    })
    .catch(error => {
      hideLoading(elements.changePasswordBtn);
      showAuthError('Gagal mengubah password: ' + error.message);
    });
}

// Confirm account deletion
function confirmDeleteAccount() {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.');
  
  if (confirmDelete) {
    deleteAccount();
  }
}

// Delete user account
function deleteAccount() {
  if (!currentUser) return;
  
  showLoading(elements.deleteAccountBtn);
  
  // Delete user data from database
  firebase.database().ref('users/' + currentUser.uid).remove()
    .then(() => {
      // Delete the user account
      return currentUser.delete();
    })
    .then(() => {
      hideLoading(elements.deleteAccountBtn);
      showSuccessMessage('Akun berhasil dihapus');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    })
    .catch(error => {
      hideLoading(elements.deleteAccountBtn);
      showAuthError('Gagal menghapus akun: ' + error.message);
    });
}

// Logout user
function logout() {
  firebase.auth().signOut()
    .then(() => {
      showSuccessMessage('Berhasil keluar');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    })
    .catch(error => {
      showAuthError('Gagal keluar: ' + error.message);
    });
}

// Load game words from Firebase
function loadGameWords() {
  firebaseHelper.getQuestions()
    .then(snapshot => {
      const questions = snapshot.val();
      gameWords = [];
      
      if (questions) {
        Object.keys(questions).forEach(key => {
          gameWords.push({
            id: key,
            word: questions[key].word.toUpperCase(),
            hint: questions[key].hint
          });
        });
      }
      
      // If no questions, add some default ones
      if (gameWords.length === 0) {
        const defaultWords = [
          { word: 'INDONESIA', hint: 'Negara dengan ribuan pulau' },
          { word: 'KOMPUTER', hint: 'Alat bantu hitung modern' },
          { word: 'PROGRAMMER', hint: 'Orang yang membuat kode' },
          { word: 'INTERNET', hint: 'Jaringan global' },
          { word: 'TELEVISI', hint: 'Alat untuk menonton berita dan hiburan' }
        ];
        
        defaultWords.forEach(word => {
          firebaseHelper.saveQuestion({
            word: word.word,
            hint: word.hint,
            createdAt: Date.now()
          });
        });
        
        gameWords = defaultWords.map(w => ({ ...w, word: w.word.toUpperCase() }));
      }
      
      // If on game page, start the game
      if (document.getElementById('game-container')) {
        startGame();
      }
    })
    .catch(error => {
      console.error('Error loading game words:', error);
      showAuthError('Gagal memuat kata. Coba lagi nanti.');
    });
}

// Start the game
function startGame() {
  if (gameWords.length === 0) {
    showAuthError('Tidak ada kata yang tersedia. Silakan tambahkan kata terlebih dahulu.');
    return;
  }
  
  // Reset game state
  isGameActive = true;
  guessedLetters = [];
  attempts = 0;
  
  // Select random word
  const randomIndex = Math.floor(Math.random() * gameWords.length);
  const selectedWord = gameWords[randomIndex];
  currentWord = selectedWord.word;
  currentQuestionId = selectedWord.id;
  
  // Update UI
  updateWordDisplay();
  updateKeyboard();
  updateGameStats();
  updateHint(selectedWord.hint);
  
  // Record start time
  gameStartTime = Date.now();
  
  // Hide result message
  if (elements.gameResult) {
    elements.gameResult.style.display = 'none';
  }
  
  // Hide start button
  if (elements.startGameBtn) {
    elements.startGameBtn.style.display = 'none';
  }
}

// Update word display
function updateWordDisplay() {
  if (!elements.wordDisplay) return;
  
  let display = '';
  for (let i = 0; i < currentWord.length; i++) {
    if (guessedLetters.includes(currentWord[i]) || currentWord[i] === ' ') {
      display += `<span class="letter-reveal">${currentWord[i]}</span>`;
    } else {
      display += '_';
    }
    
    // Add space between letters for readability
    if (i < currentWord.length - 1) {
      display += ' ';
    }
  }
  
  elements.wordDisplay.innerHTML = display;
  
  // Check if game is won
  if (!display.includes('_')) {
    endGame(true);
  }
}

// Update keyboard UI
function updateKeyboard() {
  if (!elements.keyboard) return;
  
  elements.keyboard.innerHTML = '';
  
  // Create keyboard rows
  const rows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
  ];
  
  rows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    for (let i = 0; i < row.length; i++) {
      const letter = row[i];
      const key = document.createElement('div');
      key.className = 'key';
      key.textContent = letter;
      key.dataset.letter = letter;
      
      // Add used class if letter has been guessed
      if (guessedLetters.includes(letter)) {
        key.classList.add('used');
        
        // Add correct/wrong class
        if (currentWord.includes(letter)) {
          key.classList.add('correct');
        } else {
          key.classList.add('wrong');
        }
      }
      
      // Add click event
      key.addEventListener('click', () => handleGuess(letter));
      
      rowDiv.appendChild(key);
    }
    
    elements.keyboard.appendChild(rowDiv);
  });
}

// Handle letter guess
function handleGuess(letter) {
  // Ignore if game is not active or letter already guessed
  if (!isGameActive || guessedLetters.includes(letter)) {
    return;
  }
  
  // Add to guessed letters
  guessedLetters.push(letter);
  
  // Check if letter is in the word
  if (currentWord.includes(letter)) {
    // Correct guess
    updateWordDisplay();
  } else {
    // Wrong guess
    attempts++;
    updateGameStats();
    
    // Check if game is lost
    if (attempts >= maxAttempts) {
      endGame(false);
    }
  }
  
  // Update keyboard
  updateKeyboard();
}

// Update game stats display
function updateGameStats() {
  if (elements.attemptsDisplay) {
    elements.attemptsDisplay.textContent = `${attempts}/${maxAttempts}`;
  }
  
  if (elements.scoreDisplay) {
    const score = calculateScore();
    elements.scoreDisplay.textContent = score;
  }
}

// Update hint display
function updateHint(hint) {
  if (elements.hintElement) {
    elements.hintElement.textContent = hint;
  }
}

// Calculate current score
function calculateScore() {
  if (!isGameActive) return 0;
  
  const baseScore = 100;
  const attemptDeduction = 10;
  const timeBonus = Math.max(0, 50 - Math.floor((Date.now() - gameStartTime) / 1000));
  
  return Math.max(0, baseScore - (attempts * attemptDeduction) + timeBonus);
}

// End the game
function endGame(isWin) {
  isGameActive = false;
  gameDuration = Date.now() - gameStartTime;
  
  // Show result message
  if (elements.gameResult && elements.gameResultMessage) {
    if (isWin) {
      elements.gameResultMessage.innerHTML = `
        <div class="text-center">
          <i class="fas fa-trophy" style="font-size: 3rem; color: #4ade80;"></i>
          <h3>Selamat! Anda Menang!</h3>
          <p>Anda berhasil menebak kata <strong>${currentWord}</strong></p>
          <p>Skor: <strong>${calculateScore()}</strong></p>
        </div>
      `;
      
      // Save score to leaderboard
      if (currentUser) {
        firebaseHelper.saveScore(
          currentUser.uid,
          currentUser.displayName || 'Pemain',
          calculateScore()
        );
      }
    } else {
      elements.gameResultMessage.innerHTML = `
        <div class="text-center">
          <i class="fas fa-skull" style="font-size: 3rem; color: #f87171;"></i>
          <h3>Permainan Berakhir</h3>
          <p>Kata yang benar adalah: <strong>${currentWord}</strong></p>
        </div>
      `;
    }
    
    elements.gameResult.style.display = 'block';
    
    // Show next word button
    if (elements.nextWordBtn) {
      elements.nextWordBtn.style.display = 'inline-flex';
    }
  }
}

// Load leaderboard data
function loadLeaderboard() {
  firebaseHelper.getLeaderboard()
    .then(snapshot => {
      const leaderboard = snapshot.val();
      leaderboardData = [];
      
      if (leaderboard) {
        // Convert to array and sort by score descending
        Object.keys(leaderboard).forEach(key => {
          leaderboardData.push({
            id: key,
            ...leaderboard[key]
          });
        });
        
        // Sort by score descending
        leaderboardData.sort((a, b) => b.score - a.score);
      }
      
      // Update leaderboard UI
      updateLeaderboardUI();
    })
    .catch(error => {
      console.error('Error loading leaderboard:', error);
    });
}

// Update leaderboard UI
function updateLeaderboardUI() {
  if (!elements.leaderboardTable) return;
  
  // Clear existing rows
  elements.leaderboardTable.innerHTML = '';
  
  if (leaderboardData.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="3" style="text-align: center; padding: 1.5rem;">
        Belum ada skor teratas. Ayo jadi yang pertama!
      </td>
    `;
    elements.leaderboardTable.appendChild(row);
    return;
  }
  
  // Add top 10 players
  const topPlayers = leaderboardData.slice(0, 10);
  
  topPlayers.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="width: 24px; font-weight: bold; color: ${index === 0 ? '#facc15' : index === 1 ? '#d4b196' : index === 2 ? '#ca8a04' : 'inherit'};">
            ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
          </span>
          ${player.username}
        </div>
      </td>
      <td>${player.score}</td>
      <td>${formatTimeAgo(player.timestamp)}</td>
    `;
    elements.leaderboardTable.appendChild(row);
  });
}

// Format timestamp to "time ago" string
function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} hari lalu`;
  } else if (hours > 0) {
    return `${hours} jam lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit lalu`;
  } else {
    return `${seconds} detik lalu`;
  }
}

// Load questions for management page
function loadQuestions() {
  if (!elements.questionsList) return;
  
  firebaseHelper.getQuestions()
    .then(snapshot => {
      const questions = snapshot.val();
      
      elements.questionsList.innerHTML = '';
      
      if (!questions) {
        elements.questionsList.innerHTML = `
          <div class="text-center p-4">
            <p>Belum ada soal. Ayo tambahkan soal pertama!</p>
          </div>
        `;
        return;
      }
      
      Object.keys(questions).forEach(key => {
        const question = questions[key];
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.dataset.id = key;
        
        questionCard.innerHTML = `
          <div class="question-header">
            <h3>${question.word}</h3>
            <div class="question-actions">
              <button class="btn btn-icon btn-outline edit-question" data-id="${key}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-icon btn-outline delete-question" data-id="${key}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p><strong>Petunjuk:</strong> ${question.hint}</p>
          <div class="question-meta">
            <small>Dibuat: ${formatDate(question.createdAt)}</small>
          </div>
        `;
        
        elements.questionsList.appendChild(questionCard);
      });
      
      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
          editQuestion(e.target.closest('.btn').dataset.id);
        });
      });
      
      document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteQuestion(e.target.closest('.btn').dataset.id);
        });
      });
    })
    .catch(error => {
      console.error('Error loading questions:', error);
      elements.questionsList.innerHTML = `
        <div class="text-center p-4">
          <p>Gagal memuat soal. Silakan coba lagi.</p>
        </div>
      `;
    });
}

// Edit question
function editQuestion(questionId) {
  firebase.database().ref('questions/' + questionId).once('value')
    .then(snapshot => {
      const question = snapshot.val();
      
      if (question) {
        // Fill form with question data
        elements.wordInput.value = question.word;
        elements.hintInput.value = question.hint;
        currentQuestionId = questionId;
        
        // Scroll to form
        elements.questionForm.scrollIntoView({ behavior: 'smooth' });
        
        // Update button text
        elements.saveQuestionBtn.textContent = 'Perbarui Soal';
      }
    })
    .catch(error => {
      console.error('Error fetching question:', error);
      showAuthError('Gagal memuat soal untuk diedit');
    });
}

// Save question (add or update)
function saveQuestion(e) {
  if (e) e.preventDefault();
  
  const word = elements.wordInput.value.trim().toUpperCase();
  const hint = elements.hintInput.value.trim();
  
  if (!word) {
    showAuthError('Kata tidak boleh kosong');
    return;
  }
  
  if (!hint) {
    showAuthError('Petunjuk tidak boleh kosong');
    return;
  }
  
  showLoading(elements.saveQuestionBtn);
  
  const questionData = {
    word: word,
    hint: hint,
    updatedAt: Date.now()
  };
  
  if (currentQuestionId) {
    // Update existing question
    firebaseHelper.updateQuestion(currentQuestionId, questionData)
      .then(() => {
        hideLoading(elements.saveQuestionBtn);
        showSuccessMessage('Soal berhasil diperbarui');
        resetQuestionForm();
        loadQuestions();
      })
      .catch(error => {
        hideLoading(elements.saveQuestionBtn);
        showAuthError('Gagal memperbarui soal: ' + error.message);
      });
  } else {
    // Add new question
    questionData.createdAt = Date.now();
    
    firebaseHelper.saveQuestion(questionData)
      .then(() => {
        hideLoading(elements.saveQuestionBtn);
        showSuccessMessage('Soal berhasil ditambahkan');
        resetQuestionForm();
        loadQuestions();
      })
      .catch(error => {
        hideLoading(elements.saveQuestionBtn);
        showAuthError('Gagal menambahkan soal: ' + error.message);
      });
  }
}

// Delete question
function deleteQuestion(questionId) {
  if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
    return;
  }
  
  showLoading(document.querySelector(`.delete-question[data-id="${questionId}"]`));
  
  firebaseHelper.deleteQuestion(questionId)
    .then(() => {
      hideLoading(document.querySelector(`.delete-question[data-id="${questionId}"]`));
      showSuccessMessage('Soal berhasil dihapus');
      loadQuestions();
    })
    .catch(error => {
      hideLoading(document.querySelector(`.delete-question[data-id="${questionId}"]`));
      showAuthError('Gagal menghapus soal: ' + error.message);
    });
}

// Reset question form
function resetQuestionForm() {
  elements.wordInput.value = '';
  elements.hintInput.value = '';
  currentQuestionId = null;
  elements.saveQuestionBtn.textContent = 'Simpan Soal';
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Utility functions
function showElement(element) {
  if (element) {
    element.style.display = 'block';
  }
}

function hideElement(element) {
  if (element) {
    element.style.display = 'none';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});