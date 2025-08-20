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
    // get movie parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentMovie = urlParams.get('movie');
    
    console.log('Current movie:', currentMovie); 
    
    // get word list for the selected movie
    if (currentMovie && moviesWp[currentMovie]) {
        wordList = moviesWp[currentMovie].map(word => word.toUpperCase());
        console.log('Word list:', wordList); 
    } else {
        console.error('Movie not found or no movie selected');
        wordList = [];
    }

    // initialize the game
    setMovieBackground(currentMovie);
    initGame();
    startTimer();
};

// set the background image based on the selected movie
function setMovieBackground(movieName) {
    //check if movieName is valid
    if (!movieName) {
        console.log('No movie name provided, using default background');
        return;
    }
    
    // build the filename (movieName + "Background.jpg")
    const fileName = movieName + 'Background.jpg';
    
    // build the full path
    const fullPath = `url('../Assets/${fileName}')`;
    
    // apply it to the body
    document.body.style.backgroundImage = fullPath;
    
    console.log('Background set for movie:', movieName);
    console.log('Image path:', fullPath);
}

// populate the word list based on the selected movie
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

// create empty grid
function createEmpqtyGrid() {
    gird = [];
    for (let row = 0; row < gridSize; row++) {
        const newRow = [];
        for (let col = 0; col < gridSize; col++) {
            newRow.push(''); 
        }
        grid.push(newRow);
    }
}

// place words in the grid 
function placeWords() {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [-1, 1],  // diagonal up-right
    ];
    
    wordList.forEach(word => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [dRow, dCol] = direction;
            
            // calculate valid starting positions
            const maxRow = dRow === 0 ? gridSize : (dRow > 0 ? gridSize - word.length : word.length - 1);
            const maxCol = dCol === 0 ? gridSize : (dCol > 0 ? gridSize - word.length : word.length - 1);
            
            if (maxRow <= 0 || maxCol <= 0) {
                attempts++;
                continue;
            }
            
            const startRow = Math.floor(Math.random() * maxRow);
            const startCol = Math.floor(Math.random() * maxCol);
            
            // check if word can be placed
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const row = startRow + (dRow * i);
                const col = startCol + (dCol * i);
                
                if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
                    canPlace = false;
                    break;
                }
                
                const currentLetter = grid[row][col];
                if (currentLetter !== '' && currentLetter !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            
            // place the word if possible
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    const row = startRow + (dRow * i);
                    const col = startCol + (dCol * i);
                    grid[row][col] = word[i];
                }
                placed = true;
            }
            
            attempts++;
        }
    });
}

// fill empty cells with random letters
function fillEmptyCells() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

// render the grid in HTML
function renderGrid() {
    const wordGrid = document.getElementById('wordGrid');
    if (!wordGrid) return;
    
    wordGrid.innerHTML = '';
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = grid[row][col];
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            
            // add click event listener
            cell.addEventListener('click', handleCellClick);
            
            wordGrid.appendChild(cell);
        }
    }
}

// handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    
    // toggle cell selection
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
    } else {
        cell.classList.add('selected');
        selectedCells.push({ row, col, letter: grid[row][col] });
    }
    
    updateSelectedWord();
}

// update the selected word display
function updateSelectedWord() {
    selectedWord = selectedCells.map(cell => cell.letter).join('');
    console.log('Selected word:', selectedWord);
}

// start the timer
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

// update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// initialize the game
function initGame() {
    populateWordList();
    createEmpqtyGrid();
    placeWords();
    fillEmptyCells();
    renderGrid();
    
}

// Event listener for buttons 
document.addEventListener('DOMContentLoaded', () => {
    // restart button
    const restartButton = document.querySelector('.restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            location.reload();
        });
    }
    // pause button 
    const pauseButton = document.querySelector('.pauseButton');
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            paused = !paused;
            pauseButton.textContent = paused ? 'Resume' : 'Pause';

        });
    }

    //submit button 
   const submitButton = document.querySelector('.submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            console.log('Submit clicked, selected word:', selectedWord);
            
            if (selectedWord && wordList.includes(selectedWord)) {
                // Check if word was already found
                if (foundWords.includes(selectedWord)) {
                    return;
                }
                
                foundWords.push(selectedWord);
                
                // Mark cells as found
                selectedCells.forEach(cell => {
                    const gridCell = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (gridCell) {
                        gridCell.classList.remove('selected');
                        gridCell.classList.add('found');
                    }
                });
                
                // Mark word in the word list as found
                const wordItem = document.querySelector(`[data-word="${selectedWord}"]`);
                if (wordItem) {
                    wordItem.classList.add('found');
                }
                
                // Clear selection
                selectedCells = [];
                selectedWord = '';
                updateSelectedWord();
                
                // Check if all words found
                if (foundWords.length === wordList.length) {
                    clearInterval(timer);
                    alert('Congratulations! You found all words!');
                }
                
            } else if (selectedWord === '') {
                alert('Please select some letters first!');
            } else {
                
                
                // Clear the selection
                selectedCells.forEach(cell => {
                    const gridCell = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (gridCell) {
                        gridCell.classList.remove('selected');
                    }
                });
                selectedCells = [];
                selectedWord = '';
                updateSelectedWord();
            }
        });
    }
});

