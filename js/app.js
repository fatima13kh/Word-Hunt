const gridSize = 8;
let grid = [];
let selecteCells = [];
let selectedWord = '';
let timer;
let timeLeft = 300;
let paused = false;

const movie = new URLSearchParams(window.location.search).get('movie');
const wordList = moviesWp[movie]?.map(word => word.toUpperCase()) || [];

const wordGrid = document.getElementById('wordGrid');
const timerDisplay = document.getElementById('timer');

// create the empty 8*8 grid
function createEmptyGrid() {
  grid = [];
  for (let row = 0; row < gridSize; row++) {
    const newRow = [];
    for (let col = 0; col < gridSize; col++) {
      newRow.push(''); // random letter to fill the grid
    }
    grid.push(newRow);
  }
}

// place the words horizontally in the grid
function placeWords() {
  wordList.forEach(word => {
    let placed = false;

    while (!placed) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * (gridSize - word.length + 1));

      let canPlace = true;

      for (let i = 0; i < word.length; i++) {
        const currentLetter = grid[row][col + i];
        if (currentLetter !== '' && currentLetter !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }
        placed = true;
      }
    }
  });
}






function initGame() {
  createEmptyGrid();
  placeWords();
   
}

initGame();
