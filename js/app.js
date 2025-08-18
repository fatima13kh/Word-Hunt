const gridSize = 8;
let grid = [];
let selectedCells = [];
let selectedWord = '';
let timer;
let timeLeft = 300;
let paused = false;
let foundWords = [];
let currentMovie = '';
let wordList = [];

window.onload = function() {
    // Get movie parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentMovie = urlParams.get('movie');
    
    console.log('Current movie:', currentMovie); 
    
    // Get word list for the selected movie
    if (currentMovie && moviesWp[currentMovie]) {
        wordList = moviesWp[currentMovie].map(word => word.toUpperCase());
        console.log('Word list:', wordList); 
    } else {
        console.error('Movie not found or no movie selected');
        wordList = [];
    }

    // Initialize the game
    initGame();
    startTimer();
};

// Populate the word list based on the selected movie
function populateWordList() {
    const wordListContainer = document.querySelector('.wordList');
    if (!wordListContainer) return;
    
    wordListContainer.innerHTML = '<h3>Find these words:</h3>';
    
    wordList.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'wordItem';
        wordItem.textContent = word;
        wordItem.setAttribute('data-word', word);
        wordListContainer.appendChild(wordItem);
    });
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        if (!paused && timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else if (timeLeft === 0) {
            endGame();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// End the game
function endGame() {
    clearInterval(timer);
    alert('Time\'s up!');
}

// Initialize the game
function initGame() {
    populateWordList();
    
}
