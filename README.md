# word-hunt-browser-based-game-project

Game Title: Word Hunt

What is Word Hunt Search?
Word Hunt Search is a digital twist on the classic word search puzzle. Traditionally found in newspapers or activity books, this game challenges players to find hidden words within a grid of seemingly random letters. This version will be built for the web, providing a more dynamic and interactive experience.
Players will select a themed movie, and be taken to a unique puzzle grid containing hidden words related to that themed movie. The grid includes both random letters and actual target words. The goal is to locate all hidden words within a set time limit.

 Game Concept Overview:
- It’s a one-player game.
- The player chooses a movie from a displayed list.
- After choosing, they are taken to a new screen with:
  . A grid of random letters, including hidden words.
  . A list of target words to find.
  . A timer that starts counting down immediately.
- The player clicks on letters in sequence to form words.
- If the selected letters form a correct word from the list:
  . The word is highlighted in the grid.
- If the selection is incorrect:
  . The letters turn red, then return to normal.
- The game ends when either:
  . All words are found.
  . The timer runs out.

  Game Mockup Figma link:
  https://www.figma.com/design/cna0r7vO70npfzpmsqFogU/Untitled?node-id=0-1&t=AohlFmVs1LWlfB8T-1


 Pseudocode
 1) Define necessary variables:
   - Movie titles array (6 movies for now)
   - For each movie: corresponding word list
   - Timer variable
   - Game state (playing, paused, won, lost)
   - Selected letters for current attempt

2) On page load (index.html):
   - Display game title
   - Create a grid (table or div) of movie titles
   - Each movie tile is clickable
   - Add event listeners to each movie tile

3) When a movie tile is clicked:
   - Redirect to the corresponding word hunt page related to the chosen movie 
   - On that page, read the movie name from the URL or state

4) On the word hunt game page:
   - Load the corresponding word list for the selected movie
   - Generate a grid filled with random letters
   - Insert the hidden words from the list into the grid
   - Display the word list on the side or below the grid
   - Start the countdown timer
   - Display "Back" and "Pause" buttons

5) Handle letter clicking logic:
   - Allow the user to click letters one by one
   - Keep track of clicked sequence
   - When Enter or Confirm is pressed, check if the selected sequence matches a word
       - If yes:
           - Highlight the word in the grid
           - Strike through or highlight the word in the list
       - If no:
           - Briefly show the selection in red, then reset

6) Handle pause and back button:
   - Pause button toggles game state and stops timer
   - Back button returns to index.html and clears game state

7) Monitor game state:
   - If all words are found:
       - Stop timer
       - Display a “You Win!” 
   - If timer reaches 0:
       - Display a “You Lose!” 

8) Provide reset/play again functionality:
   - Button to restart the same puzzle
   - Or redirect to the home page to pick a new movie


   Game Future enhancement :- 

   1- Points will be gathered to see the score 
   2- Player can choose which character to play with for each movie 
   3- Audio will be played based on the selected movie 
   4- There will be levels eady, medium and hard

