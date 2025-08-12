// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk-0bfLE8m00HMHGR4HFctW58KRWi_Psw",
  authDomain: "xbibz-tools.firebaseapp.com",
  databaseURL: "https://xbibz-tools-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xbibz-tools",
  storageBucket: "xbibz-tools.firebasestorage.app",
  messagingSenderId: "728866559765",
  appId: "1:728866559765:web:c44d19112638a86a377b1c",
  measurementId: "G-LFGHF7JXBN"
};

// Initialize Firebase
let app;
let auth;
let database;

function initializeFirebase() {
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    
    // Enable persistence
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch((error) => {
        console.error("Persistence error:", error);
      });
    
    // Set up auth state listener
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        window.currentUser = user;
        updateUIForAuthenticatedUser();
      } else {
        // User is signed out
        window.currentUser = null;
        updateUIForNonAuthenticatedUser();
      }
    });
  } else {
    app = firebase.app();
    auth = firebase.auth();
    database = firebase.database();
  }
}

// Call initialization function
initializeFirebase();

// Helper functions for Firebase operations
const firebaseHelper = {
  saveUserData: (userId, userData) => {
    return database.ref('users/' + userId).update(userData);
  },
  
  getUserData: (userId) => {
    return database.ref('users/' + userId).once('value');
  },
  
  saveScore: (userId, username, score) => {
    const newScoreRef = database.ref('leaderboard').push();
    return newScoreRef.set({
      userId: userId,
      username: username,
      score: score,
      timestamp: Date.now()
    });
  },
  
  getLeaderboard: () => {
    return database.ref('leaderboard').orderByChild('score').limitToLast(10).once('value');
  },
  
  saveQuestion: (questionData) => {
    const newQuestionRef = database.ref('questions').push();
    return newQuestionRef.set(questionData);
  },
  
  getQuestions: () => {
    return database.ref('questions').once('value');
  },
  
  updateQuestion: (questionId, questionData) => {
    return database.ref('questions/' + questionId).update(questionData);
  },
  
  deleteQuestion: (questionId) => {
    return database.ref('questions/' + questionId).remove();
  }
};