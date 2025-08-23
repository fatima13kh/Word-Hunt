const gridSize = 8;
let grid = [];
let selectedCells = [];
let selectedWord = '';
let timer;
let timeLeft = 200;
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

// instruction popup function 
function showInstructions() {
    const instructionsPopup = document.createElement('div');
    instructionsPopup.className = 'instructions-popup';

    instructionsPopup.innerHTML = `
        <h2>Game Instructions</h2>
        <p>Click on the name of the movie to be directed to the word search based on the theme.</p>
        <p>Look at the list of words and click on them in the correct order.</p>
        <p>You can choose the same letter more than once if it occurs in the same path (diagonal, horizontal, or vertical).</p>
        <p>If you find all the words and cross the whole list, you win!</p>
        <p>If the timer runs out and you haven't chosen anything, you lose.</p>
        <p>You can pause or restart the game anytime you want.</p>
        <button class="close-instructions">Close</button>
    `;

    document.body.appendChild(instructionsPopup);

    // Close the instructions popup
    const closeButton = instructionsPopup.querySelector('.close-instructions');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.body.removeChild(instructionsPopup);
        });
    }
}

// set the background image based on the selected movie
function setMovieBackground(movieName) {
    if (!movieName) {
        console.log('No movie name provided, using default background');
        return;
    }

    const fileName = movieName + 'Background.jpg';

    // detect if running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');

    // choose the path based on environment
    const imagePath = isGitHubPages
        ? `Assets/${fileName}` // absolute URL for GitHub Pages
        : `../Assets/${fileName}`; // relative path for local testing

    document.body.style.backgroundImage = `url('${imagePath}')`;

    console.log('Background set for movie:', movieName);
    console.log('Image path:', imagePath);
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
        [1, 1]   // diagonal down-right
    ];
    
    wordList.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [dRow, dCol] = direction;

            // Calculate valid starting positions based on word length and direction
            const maxRow = dRow === 0 ? gridSize : (dRow > 0 ? gridSize - word.length : gridSize - 1);
            const maxCol = dCol === 0 ? gridSize : (dCol > 0 ? gridSize - word.length : gridSize - 1);

            if (maxRow < 0 || maxCol < 0) {
                attempts++;
                continue; // Skip this attempt if the max positions are invalid
            }

            const startRow = Math.floor(Math.random() * (maxRow + 1)); // Include maxRow
            const startCol = Math.floor(Math.random() * (maxCol + 1)); // Include maxCol

            // Check if the word can be placed
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const row = startRow + (dRow * i);
                const col = startCol + (dCol * i);

                // Check bounds
                if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
                    canPlace = false;
                    break;
                }

                const currentLetter = grid[row][col];
                // Check if the cell is empty or matches the word's letter
                if (currentLetter !== '' && currentLetter !== word[i]) {
                    canPlace = false;
                    break;
                }
            }

            // Place the word if possible
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    const row = startRow + (dRow * i);
                    const col = startCol + (dCol * i);
                    grid[row][col] = word[i]; // Place the letter in the grid
                }
                placed = true; // Mark the word as placed
            }

            attempts++; // Increment attempts counter
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

//end the game when time is up
function endGame() {
    clearInterval(timer);
    
    if (foundWords.length === wordList.length) {
        showPopUp('win');
    } else {
        showPopUp('lose');
    }
}

function showPopUp(result) {
    const popUp = document.createElement('div');
    popUp.className = 'popup';

    const message = result === 'win' ? 'Congratulations! You Win!' : 'Time is up, You Lose!';
    const gifName = result === 'win' ? `${currentMovie}WinGIF.gif` : `${currentMovie}LoseGIF.gif`;
    const gifPath = `Assets/${gifName}`; 

    popUp.innerHTML = `
        <h2>${message}</h2>
        <img src="${gifPath}" alt="${message}" />
        <button class="close-popup">Close</button>
    `;

    document.body.appendChild(popUp);

    // Close pop-up on button click
    const closeButton = popUp.querySelector('.close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popUp);
            location.reload(); // reload the game
        });
    }
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
    // instructions button
    const infoIcon = document.querySelector('.info-icon');
    if (infoIcon) {
        infoIcon.addEventListener('click', showInstructions);
    }
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
                alert('You already found this word!');
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
                showPopUp('win');
            }
            
        } else {
            // WRONG WORD - Show red feedback then clear
            const wrongCells = [...selectedCells]; // Save cells before clearing
            
            // Highlight cells red
            wrongCells.forEach(cell => {
                const gridCell = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                if (gridCell) {
                    gridCell.classList.remove('selected');
                    gridCell.classList.add('wrong');
                }
            });
            
            // Also highlight the word in the list if it matches any word
            const wordItem = document.querySelector(`[data-word="${selectedWord}"]`);
            if (wordItem) {
                wordItem.classList.add('wrong');
            }
            
            // Clear selection immediately
            selectedCells = [];
            selectedWord = '';
            updateSelectedWord();
            
            // After 1 second, remove red styling from both grid and word list
            setTimeout(() => {
                wrongCells.forEach(cell => {
                    const gridCell = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (gridCell) {
                        gridCell.classList.remove('wrong');
                    }
                });
                
                // Remove red from word list too
                const wordItems = document.querySelectorAll('.wordItem.wrong');
                wordItems.forEach(item => {
                    item.classList.remove('wrong');
                });
            }, 1000);
        }
    });
}
});

