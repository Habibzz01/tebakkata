// Global Variables
let currentUser = null;
let gameData = {
  currentQuestion: null,
  score: 0,
  lives: 3,
  timer: null,
  timeLeft: 60,
  usedLetters: [],
  correctLetters: [],
  gameActive: false
};

// DOM Elements
const elements = {
  // Auth Elements
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  forgotPasswordForm: document.getElementById('forgotPasswordForm'),
  googleLoginBtn: document.getElementById('googleLoginBtn'),
  
  // Profile Elements
  profileForm: document.getElementById('profileForm'),
  changePasswordForm: document.getElementById('changePasswordForm'),
  deleteAccountBtn: document.getElementById('deleteAccountBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  
  // Game Elements
  gameContainer: document.getElementById('gameContainer'),
  wordDisplay: document.getElementById('wordDisplay'),
  hintDisplay: document.getElementById('hintDisplay'),
  categoryDisplay: document.getElementById('categoryDisplay'),
  keyboard: document.getElementById('keyboard'),
  scoreDisplay: document.getElementById('scoreDisplay'),
  livesDisplay: document.getElementById('livesDisplay'),
  timerDisplay: document.getElementById('timerDisplay'),
  startGameBtn: document.getElementById('startGameBtn'),
  newGameBtn: document.getElementById('newGameBtn'),
  
  // Leaderboard Elements
  leaderboardList: document.getElementById('leaderboardList'),
  
  // Question Management Elements
  questionForm: document.getElementById('questionForm'),
  questionList: document.getElementById('questionList'),
  
  // UI Elements
  themeToggle: document.getElementById('themeToggle'),
  notificationContainer: document.getElementById('notificationContainer'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  
  // Modal Elements
  gameOverModal: document.getElementById('gameOverModal'),
  gameOverTitle: document.getElementById('gameOverTitle'),
  gameOverMessage: document.getElementById('gameOverMessage'),
  gameOverScore: document.getElementById('gameOverScore'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  
  // Dashboard Elements
  dashboardStats: document.getElementById('dashboardStats'),
  recentActivity: document.getElementById('recentActivity')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Check theme preference
  checkThemePreference();
  
  // Set up theme toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Check authentication state
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      loadUserData();
      showAuthenticatedUI();
    } else {
      currentUser = null;
      showUnauthenticatedUI();
    }
  });
  
  // Set up event listeners
  setupEventListeners();
  
  // Load leaderboard
  loadLeaderboard();
  
  // Initialize game keyboard
  initializeKeyboard();
}

// Theme Management
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (elements.themeToggle) {
      elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  } else {
    document.body.classList.remove('dark-theme');
    if (elements.themeToggle) {
      elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  if (elements.themeToggle) {
    elements.themeToggle.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Authentication Functions
function setupEventListeners() {
  // Login form
  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', handleLogin);
  }
  
  // Register form
  if (elements.registerForm) {
    elements.registerForm.addEventListener('submit', handleRegister);
  }
  
  // Forgot password form
  if (elements.forgotPasswordForm) {
    elements.forgotPasswordForm.addEventListener('submit', handleForgotPassword);
  }
  
  // Google login
  if (elements.googleLoginBtn) {
    elements.googleLoginBtn.addEventListener('click', handleGoogleLogin);
  }
  
  // Profile form
  if (elements.profileForm) {
    elements.profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Change password form
  if (elements.changePasswordForm) {
    elements.changePasswordForm.addEventListener('submit', handleChangePassword);
  }
  
  // Delete account
  if (elements.deleteAccountBtn) {
    elements.deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }
  
  // Logout
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Game buttons
  if (elements.startGameBtn) {
    elements.startGameBtn.addEventListener('click', startNewGame);
  }
  
  if (elements.newGameBtn) {
    elements.newGameBtn.addEventListener('click', startNewGame);
  }
  
  if (elements.playAgainBtn) {
    elements.playAgainBtn.addEventListener('click', () => {
      elements.gameOverModal.style.display = 'none';
      startNewGame();
    });
  }
  
  // Question form
  if (elements.questionForm) {
    elements.questionForm.addEventListener('submit', handleQuestionSubmit);
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  showLoading();
  
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      hideLoading();
      showNotification('Login successful!', 'success');
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      hideLoading();
      showNotification(error.message, 'danger');
    });
}

function handleRegister(e) {
  e.preventDefault();
  
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const username = document.getElementById('registerUsername').value;
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match!', 'danger');
    return;
  }
  
  if (password.length < 6) {
    showNotification('Password should be at least 6 characters!', 'danger');
    return;
  }
  
  showLoading();
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      
      // Create user profile in database
      usersRef.child(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        totalScore: 0,
        gamesPlayed: 0,
        highestScore: 0
      });
      
      hideLoading();
      showNotification('Registration successful!', 'success');
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      hideLoading();
      showNotification(error.message, 'danger');
    });
}

function handleGoogleLogin() {
  showLoading();
  
  auth.signInWithPopup(googleProvider)
    .then(result => {
      const user = result.user;
      
      // Check if user exists in database
      usersRef.child(user.uid).once('value', snapshot => {
        if (!snapshot.exists()) {
          // Create user profile in database
          usersRef.child(user.uid).set({
            username: user.displayName,
            email: user.email,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            totalScore: 0,
            gamesPlayed: 0,
            highestScore: 0
          });
        }
      });
      
      hideLoading();
      showNotification('Login successful!', 'success');
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      hideLoading();
      showNotification(error.message, 'danger');
    });
}

function handleForgotPassword(e) {
  e.preventDefault();
  
  const email = document.getElementById('forgotEmail').value;
  
  showLoading();
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      hideLoading();
      showNotification('Password reset email sent!', 'success');
      window.location.href = 'login.html';
    })
    .catch(error => {
      hideLoading();
      showNotification(error.message, 'danger');
    });
}

function handleProfileUpdate(e) {
  e.preventDefault();
  
  const username = document.getElementById('profileUsername').value;
  
  showLoading();
  
  usersRef.child(currentUser.uid).update({
    username: username
  })
  .then(() => {
    hideLoading();
    showNotification('Profile updated successfully!', 'success');
    loadUserData();
  })
  .catch(error => {
    hideLoading();
    showNotification(error.message, 'danger');
  });
}

function handleChangePassword(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
  if (newPassword !== confirmNewPassword) {
    showNotification('New passwords do not match!', 'danger');
    return;
  }
  
  if (newPassword.length < 6) {
    showNotification('Password should be at least 6 characters!', 'danger');
    return;
  }
  
  showLoading();
  
  // Re-authenticate user first
  const credential = firebase.auth.EmailAuthProvider.credential(
    currentUser.email,
    currentPassword
  );
  
  currentUser.reauthenticateWithCredential(credential)
    .then(() => {
      // Update password
      return currentUser.updatePassword(newPassword);
    })
    .then(() => {
      hideLoading();
      showNotification('Password updated successfully!', 'success');
      document.getElementById('changePasswordForm').reset();
    })
    .catch(error => {
      hideLoading();
      showNotification(error.message, 'danger');
    });
}

function handleDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    showLoading();
    
    // Delete user data from database
    usersRef.child(currentUser.uid).remove()
      .then(() => {
        // Delete user authentication
        return currentUser.delete();
      })
      .then(() => {
        hideLoading();
        showNotification('Account deleted successfully!', 'success');
        window.location.href = 'index.html';
      })
      .catch(error => {
        hideLoading();
        showNotification(error.message, 'danger');
      });
  }
}

function handleLogout() {
  auth.signOut()
    .then(() => {
      showNotification('Logged out successfully!', 'success');
      window.location.href = 'index.html';
    })
    .catch(error => {
      showNotification(error.message, 'danger');
    });
}

// User Data Functions
function loadUserData() {
  if (!currentUser) return;
  
  usersRef.child(currentUser.uid).once('value', snapshot => {
    const userData = snapshot.val();
    
    if (userData) {
      // Update profile page
      if (document.getElementById('profileUsername')) {
        document.getElementById('profileUsername').value = userData.username || '';
      }
      
      if (document.getElementById('profileEmail')) {
        document.getElementById('profileEmail').value = userData.email || currentUser.email;
      }
      
      if (document.getElementById('profileDisplayName')) {
        document.getElementById('profileDisplayName').textContent = userData.username || 'User';
      }
      
      // Update dashboard stats
      if (elements.dashboardStats) {
        updateDashboardStats(userData);
      }
      
      // Update recent activity
      if (elements.recentActivity) {
        loadRecentActivity();
      }
    }
  });
}

function updateDashboardStats(userData) {
  const statsContainer = elements.dashboardStats;
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="dashboard-card">
      <div class="dashboard-card-icon">
        <i class="fas fa-trophy"></i>
      </div>
      <h3 class="dashboard-card-title">Highest Score</h3>
      <div class="dashboard-card-value">${userData.highestScore || 0}</div>
      <p class="dashboard-card-description">Your best game score</p>
    </div>
    <div class="dashboard-card">
      <div class="dashboard-card-icon">
        <i class="fas fa-gamepad"></i>
      </div>
      <h3 class="dashboard-card-title">Games Played</h3>
      <div class="dashboard-card-value">${userData.gamesPlayed || 0}</div>
      <p class="dashboard-card-description">Total games you've played</p>
    </div>
    <div class="dashboard-card">
      <div class="dashboard-card-icon">
        <i class="fas fa-star"></i>
      </div>
      <h3 class="dashboard-card-title">Total Score</h3>
      <div class="dashboard-card-value">${userData.totalScore || 0}</div>
      <p class="dashboard-card-description">Combined score from all games</p>
    </div>
  `;
}

function loadRecentActivity() {
  const activityContainer = elements.recentActivity;
  if (!activityContainer) return;
  
  // Get user's recent games
  database.ref(`userGames/${currentUser.uid}`).orderByChild('timestamp').limitToLast(5).once('value', snapshot => {
    const games = [];
    snapshot.forEach(childSnapshot => {
      games.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to get most recent first
    games.reverse();
    
    if (games.length === 0) {
      activityContainer.innerHTML = '<p class="text-center">No recent activity</p>';
      return;
    }
    
    let activityHTML = '<ul class="activity-list">';
    
    games.forEach(game => {
      const date = new Date(game.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      activityHTML += `
        <li class="activity-item">
          <div class="activity-icon">
            <i class="fas fa-gamepad"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">Scored ${game.score} points</div>
            <div class="activity-time">${formattedDate}</div>
          </div>
        </li>
      `;
    });
    
    activityHTML += '</ul>';
    activityContainer.innerHTML = activityHTML;
  });
}

// UI Management Functions
function showAuthenticatedUI() {
  // Show elements for authenticated users
  const authElements = document.querySelectorAll('.auth-only');
  authElements.forEach(el => {
    el.style.display = 'block';
  });
  
  // Hide elements for unauthenticated users
  const noAuthElements = document.querySelectorAll('.no-auth-only');
  noAuthElements.forEach(el => {
    el.style.display = 'none';
  });
  
  // Update user display name
  if (currentUser && document.getElementById('userDisplayName')) {
    usersRef.child(currentUser.uid).once('value', snapshot => {
      const userData = snapshot.val();
      if (userData && userData.username) {
        document.getElementById('userDisplayName').textContent = userData.username;
      } else {
        document.getElementById('userDisplayName').textContent = 'User';
      }
    });
  }
}

function showUnauthenticatedUI() {
  // Hide elements for authenticated users
  const authElements = document.querySelectorAll('.auth-only');
  authElements.forEach(el => {
    el.style.display = 'none';
  });
  
  // Show elements for unauthenticated users
  const noAuthElements = document.querySelectorAll('.no-auth-only');
  noAuthElements.forEach(el => {
    el.style.display = 'block';
  });
}

function showLoading() {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = 'block';
  }
}

function hideLoading() {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = 'none';
  }
}

function showNotification(message, type = 'info') {
  if (!elements.notificationContainer) return;
  
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} fade-in`;
  notification.textContent = message;
  
  elements.notificationContainer.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Game Functions
function initializeKeyboard() {
  if (!elements.keyboard) return;
  
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  elements.keyboard.innerHTML = '';
  
  for (const letter of letters) {
    const key = document.createElement('button');
    key.className = 'key';
    key.textContent = letter;
    key.dataset.letter = letter;
    key.addEventListener('click', () => handleLetterClick(letter));
    elements.keyboard.appendChild(key);
  }
}

function startNewGame() {
  if (!currentUser) {
    showNotification('Please login to play!', 'warning');
    return;
  }
  
  // Reset game data
  gameData = {
    currentQuestion: null,
    score: 0,
    lives: 3,
    timer: null,
    timeLeft: 60,
    usedLetters: [],
    correctLetters: [],
    gameActive: true
  };
  
  // Reset UI
  if (elements.scoreDisplay) {
    elements.scoreDisplay.textContent = '0';
  }
  
  if (elements.livesDisplay) {
    elements.livesDisplay.innerHTML = '<i class="fas fa-heart"></i>'.repeat(3);
  }
  
  if (elements.timerDisplay) {
    elements.timerDisplay.textContent = '60';
  }
  
  // Reset keyboard
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    key.classList.remove('used', 'correct', 'incorrect');
  });
  
  // Load a random question
  loadRandomQuestion();
  
  // Start timer
  startTimer();
  
  // Show game container
  if (elements.gameContainer) {
    elements.gameContainer.style.display = 'block';
  }
}

function loadRandomQuestion() {
  questionsRef.once('value', snapshot => {
    const questions = [];
    snapshot.forEach(childSnapshot => {
      questions.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    if (questions.length === 0) {
      showNotification('No questions available!', 'warning');
      endGame();
      return;
    }
    
    // Select random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    gameData.currentQuestion = questions[randomIndex];
    
    // Update UI
    updateGameUI();
  });
}

function updateGameUI() {
  if (!gameData.currentQuestion) return;
  
  // Update word display
  if (elements.wordDisplay) {
    const word = gameData.currentQuestion.word.toUpperCase();
    let displayWord = '';
    
    for (const letter of word) {
      if (gameData.correctLetters.includes(letter)) {
        displayWord += letter + ' ';
      } else {
        displayWord += '_ ';
      }
    }
    
    elements.wordDisplay.textContent = displayWord.trim();
  }
  
  // Update hint display
  if (elements.hintDisplay && gameData.currentQuestion.hint) {
    elements.hintDisplay.textContent = gameData.currentQuestion.hint;
  }
  
  // Update category display
  if (elements.categoryDisplay && gameData.currentQuestion.category) {
    elements.categoryDisplay.innerHTML = `<span class="category-badge">${gameData.currentQuestion.category}</span>`;
  }
}

function handleLetterClick(letter) {
  if (!gameData.gameActive || gameData.usedLetters.includes(letter)) {
    return;
  }
  
  // Mark letter as used
  gameData.usedLetters.push(letter);
  
  // Update key UI
  const key = document.querySelector(`.key[data-letter="${letter}"]`);
  if (key) {
    key.classList.add('used');
  }
  
  // Check if letter is in the word
  const word = gameData.currentQuestion.word.toUpperCase();
  if (word.includes(letter)) {
    // Correct letter
    gameData.correctLetters.push(letter);
    if (key) {
      key.classList.add('correct');
    }
    
    // Update score
    gameData.score += 10;
    if (elements.scoreDisplay) {
      elements.scoreDisplay.textContent = gameData.score;
    }
    
    // Check if word is complete
    let wordComplete = true;
    for (const wordLetter of word) {
      if (!gameData.correctLetters.includes(wordLetter)) {
        wordComplete = false;
        break;
      }
    }
    
    if (wordComplete) {
      // Word completed
      gameData.score += 50; // Bonus for completing word
      if (elements.scoreDisplay) {
        elements.scoreDisplay.textContent = gameData.score;
      }
      
      showNotification('Word completed! +50 bonus points', 'success');
      
      // Load next question
      setTimeout(() => {
        loadRandomQuestion();
      }, 1500);
    } else {
      // Update word display
      updateGameUI();
    }
  } else {
    // Incorrect letter
    if (key) {
      key.classList.add('incorrect');
    }
    
    // Lose a life
    gameData.lives--;
    updateLivesDisplay();
    
    if (gameData.lives <= 0) {
      // Game over
      endGame();
    }
  }
}

function updateLivesDisplay() {
  if (!elements.livesDisplay) return;
  
  elements.livesDisplay.innerHTML = '<i class="fas fa-heart"></i>'.repeat(gameData.lives);
}

function startTimer() {
  if (gameData.timer) {
    clearInterval(gameData.timer);
  }
  
  gameData.timer = setInterval(() => {
    gameData.timeLeft--;
    
    if (elements.timerDisplay) {
      elements.timerDisplay.textContent = gameData.timeLeft;
    }
    
    if (gameData.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameData.gameActive = false;
  
  // Stop timer
  if (gameData.timer) {
    clearInterval(gameData.timer);
    gameData.timer = null;
  }
  
  // Update user stats
  if (currentUser) {
    usersRef.child(currentUser.uid).once('value', snapshot => {
      const userData = snapshot.val();
      
      if (userData) {
        const updatedData = {
          totalScore: (userData.totalScore || 0) + gameData.score,
          gamesPlayed: (userData.gamesPlayed || 0) + 1,
          highestScore: Math.max(userData.highestScore || 0, gameData.score)
        };
        
        usersRef.child(currentUser.uid).update(updatedData);
        
        // Save game to user's game history
        database.ref(`userGames/${currentUser.uid}`).push({
          score: gameData.score,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Update leaderboard if score is high enough
        updateLeaderboard(gameData.score);
      }
    });
  }
  
  // Show game over modal
  showGameOverModal();
}

function showGameOverModal() {
  if (!elements.gameOverModal) return;
  
  const isWin = gameData.lives > 0;
  
  if (elements.gameOverTitle) {
    elements.gameOverTitle.textContent = isWin ? 'Congratulations!' : 'Game Over!';
  }
  
  if (elements.gameOverMessage) {
    elements.gameOverMessage.textContent = isWin ? 
      `You guessed the word: ${gameData.currentQuestion.word}` : 
      `The word was: ${gameData.currentQuestion.word}`;
  }
  
  if (elements.gameOverScore) {
    elements.gameOverScore.textContent = `Your score: ${gameData.score}`;
  }
  
  elements.gameOverModal.style.display = 'flex';
}

// Leaderboard Functions
function loadLeaderboard() {
  if (!elements.leaderboardList) return;
  
  leaderboardRef.orderByChild('score').limitToLast(10).once('value', snapshot => {
    const leaderboard = [];
    snapshot.forEach(childSnapshot => {
      leaderboard.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to get highest score first
    leaderboard.reverse();
    
    if (leaderboard.length === 0) {
      elements.leaderboardList.innerHTML = '<li class="leaderboard-item">No scores yet</li>';
      return;
    }
    
    let leaderboardHTML = '';
    
    leaderboard.forEach((entry, index) => {
      const date = new Date(entry.timestamp);
      const formattedDate = `${date.toLocaleDateString()}`;
      
      leaderboardHTML += `
        <li class="leaderboard-item">
          <div class="leaderboard-rank">#${index + 1}</div>
          <div class="leaderboard-name">${entry.username}</div>
          <div class="leaderboard-score">${entry.score}</div>
        </li>
      `;
    });
    
    elements.leaderboardList.innerHTML = leaderboardHTML;
  });
}

function updateLeaderboard(score) {
  if (!currentUser || score <= 0) return;
  
  // Get current user data
  usersRef.child(currentUser.uid).once('value', snapshot => {
    const userData = snapshot.val();
    
    if (userData) {
      // Check if user already has a score on leaderboard
      leaderboardRef.orderByChild('userId').equalTo(currentUser.uid).once('value', snapshot => {
        let userEntry = null;
        
        snapshot.forEach(childSnapshot => {
          userEntry = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          };
        });
        
        if (userEntry) {
          // Update existing entry if new score is higher
          if (score > userEntry.score) {
            leaderboardRef.child(userEntry.id).update({
              score: score,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            });
          }
        } else {
          // Add new entry
          leaderboardRef.push({
            userId: currentUser.uid,
            username: userData.username,
            score: score,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
        }
        
        // Refresh leaderboard display
        loadLeaderboard();
      });
    }
  });
}

// Question Management Functions
function loadQuestions() {
  if (!elements.questionList) return;
  
  questionsRef.once('value', snapshot => {
    const questions = [];
    snapshot.forEach(childSnapshot => {
      questions.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    if (questions.length === 0) {
      elements.questionList.innerHTML = '<p class="text-center">No questions available</p>';
      return;
    }
    
    let questionsHTML = '';
    
    questions.forEach(question => {
      questionsHTML += `
        <div class="question-item" data-id="${question.id}">
          <div class="question-header">
            <h4>${question.word}</h4>
            <div class="question-actions">
              <button class="btn btn-sm btn-primary edit-question" data-id="${question.id}">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-sm btn-danger delete-question" data-id="${question.id}">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          <p><strong>Hint:</strong> ${question.hint}</p>
          <p><strong>Category:</strong> ${question.category}</p>
        </div>
      `;
    });
    
    elements.questionList.innerHTML = questionsHTML;
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-question').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const questionId = e.currentTarget.dataset.id;
        editQuestion(questionId);
      });
    });
    
    document.querySelectorAll('.delete-question').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const questionId = e.currentTarget.dataset.id;
        deleteQuestion(questionId);
      });
    });
  });
}

function handleQuestionSubmit(e) {
  e.preventDefault();
  
  const word = document.getElementById('questionWord').value.trim();
  const hint = document.getElementById('questionHint').value.trim();
  const category = document.getElementById('questionCategory').value.trim();
  const questionId = document.getElementById('questionId').value;
  
  if (!word || !hint || !category) {
    showNotification('Please fill in all fields!', 'danger');
    return;
  }
  
  showLoading();
  
  const questionData = {
    word: word,
    hint: hint,
    category: category,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };
  
  if (questionId) {
    // Update existing question
    questionsRef.child(questionId).update(questionData)
      .then(() => {
        hideLoading();
        showNotification('Question updated successfully!', 'success');
        document.getElementById('questionForm').reset();
        document.getElementById('questionId').value = '';
        loadQuestions();
      })
      .catch(error => {
        hideLoading();
        showNotification(error.message, 'danger');
      });
  } else {
    // Add new question
    questionsRef.push(questionData)
      .then(() => {
        hideLoading();
        showNotification('Question added successfully!', 'success');
        document.getElementById('questionForm').reset();
        loadQuestions();
      })
      .catch(error => {
        hideLoading();
        showNotification(error.message, 'danger');
      });
  }
}

function editQuestion(questionId) {
  questionsRef.child(questionId).once('value', snapshot => {
    const question = snapshot.val();
    
    if (question) {
      document.getElementById('questionWord').value = question.word;
      document.getElementById('questionHint').value = question.hint;
      document.getElementById('questionCategory').value = question.category;
      document.getElementById('questionId').value = questionId;
      
      // Scroll to form
      document.getElementById('questionForm').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function deleteQuestion(questionId) {
  if (confirm('Are you sure you want to delete this question?')) {
    showLoading();
    
    questionsRef.child(questionId).remove()
      .then(() => {
        hideLoading();
        showNotification('Question deleted successfully!', 'success');
        loadQuestions();
      })
      .catch(error => {
        hideLoading();
        showNotification(error.message, 'danger');
      });
  }
}

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) {
    strength += 1;
  }
  
  // Complexity checks
  if (password.match(/[a-z]+/)) {
    strength += 1;
  }
  
  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }
  
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }
  
  if (password.match(/[$@#&!]+/)) {
    strength += 1;
  }
  
  return strength;
}

function updatePasswordStrength(password) {
  const strengthBar = document.getElementById('passwordStrengthBar');
  const strengthText = document.getElementById('passwordStrengthText');
  
  if (!strengthBar || !strengthText) return;
  
  const strength = checkPasswordStrength(password);
  
  // Reset classes
  strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  
  if (password.length === 0) {
    strengthBar.style.width = '0';
    strengthText.textContent = '';
  } else if (strength <= 2) {
    strengthBar.classList.add('strength-weak');
    strengthBar.style.width = '33.33%';
    strengthText.textContent = 'Weak';
    strengthText.style.color = 'var(--danger-color)';
  } else if (strength <= 3) {
    strengthBar.classList.add('strength-medium');
    strengthBar.style.width = '66.66%';
    strengthText.textContent = 'Medium';
    strengthText.style.color = 'var(--warning-color)';
  } else {
    strengthBar.classList.add('strength-strong');
    strengthBar.style.width = '100%';
    strengthText.textContent = 'Strong';
    strengthText.style.color = 'var(--success-color)';
  }
}

// Add event listeners for password strength checking
document.addEventListener('DOMContentLoaded', () => {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach(input => {
    if (input.id === 'registerPassword' || input.id === 'newPassword') {
      input.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
      });
    }
  });
});