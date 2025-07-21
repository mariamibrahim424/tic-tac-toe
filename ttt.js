let currentPlayer = 'x';
let playerStatus = null;
let moves = null ;
let winner = null;
const winningConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],   
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];
let gameState =['','','','','','','','','',''];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function setupgame(id){
    winner = null;
    moves = ['1','2','3','4','5','6','7','8','9'];
    gameState = ['','','','','','','','','',''];
    playerStatus = document.getElementById('turn');
    for (let i=1; i < 10; i++){
        const node = document.getElementById(i.toString());
        node.style.visibility = "visible";
        if (id == 'single'){
            node.addEventListener('click',playSingle);
        }
        else{
            node.addEventListener('click',playMulti);
        }
        currentTile = i;
        node.innerHTML = '';
    }
    currentPlayer = 'x';
    playerStatus.innerHTML = 'X turn...'
}
// Play with AI
function playSingle(){
    this.innerHTML = currentPlayer.toUpperCase();
    let index = parseInt(this.id);
    gameState[index] = currentPlayer;
    currentPlayer = ((currentPlayer == 'o') ? 'x' : 'o');
    this.removeEventListener('click', playSingle);
    moves.splice(moves.indexOf(this.id),1);
    playerStatus.innerHTML = `${currentPlayer.toUpperCase()} turn...`;
    determineWinner();
    sleep(500).then(() => { 
        if (moves.length > 0 && winner == null){
            var item = getBestMove(gameState.slice(), currentPlayer);
            let node = document.getElementById(item);
            node.innerHTML = currentPlayer.toUpperCase();
            let index = parseInt(node.id);
            gameState[index] = currentPlayer;
            currentPlayer = ((currentPlayer == 'o') ? 'x' : 'o');
            node.removeEventListener('click', playSingle);
            moves.splice(moves.indexOf(node.id),1);
            playerStatus.innerHTML = `${currentPlayer.toUpperCase()} turn...`;
            determineWinner();
        }
    });
}
// Play with a friend
function playMulti(){
    this.innerHTML = currentPlayer.toUpperCase();
    let index = parseInt(this.id);
    gameState[index] = currentPlayer;
    currentPlayer = ((currentPlayer == 'o') ? 'x' : 'o');
    this.removeEventListener('click', playMulti);
    moves.splice(moves.indexOf(this.id),1);
    playerStatus.innerHTML = `${currentPlayer.toUpperCase()} turn...`;
    determineWinner();
}
// Checks if there's a winner or draw
function determineWinner() {
    for (let i=0; i < 8; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }

        if(a === b && b===c){
            playerStatus.innerHTML = `${a.toUpperCase()} is the winner!`;
            celebrate();
            winner = a;
            disable();
            document.getElementById("multi").style.visibility = "visible";
            document.getElementById("single").style.visibility = "visible";
        }
    }
    if (moves.length == 0 && winner==null) {
        playerStatus.innerHTML = 'Draw...';
        disable();
        document.getElementById("multi").style.visibility = "visible";
        document.getElementById("single").style.visibility = "visible";
        return;
    }
}

function disable(){
    for (let i=1; i < 10; i++){
        const node = document.getElementById(i.toString())
        node.removeEventListener('click',playMulti);
        node.removeEventListener('click',playSingle);
    }
}
// Confetti
function celebrate() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Returns the best move for the AI using minimax
function getBestMove(state, player) {
    let bestScore = -Infinity; 
    let bestMove = null;

    for (let i = 1; i <= 9; i++) {
        if (state[i] === '') { // check if the current position is empty 
            state[i] = player; // try playing this position 
            let score = minimax(state, 0, false, player); // check the score for position
            state[i] = ''; // reset position back to empty
            // update values if better score is found
            if (score > bestScore) {
                bestScore = score; 
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Minimax algo
// state: copy of current board array
// depth: game depth (used to find faster wins)
// isMaximizing: true is AI's turn, false is pponent's turn
// aiPlayer: X or O
function minimax(state, depth, isMaximizing, aiPlayer) {
    const opponent = aiPlayer === 'x' ? 'o' : 'x';
    const result = checkWinner(state);
    // game is over
    if (result !== null) {
        const scores = {};
        scores[aiPlayer] = 10 - depth;
        scores[opponent] = depth - 10;
        scores['draw'] = 0;
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 1; i <= 9; i++) {
            if (state[i] === '') {
                state[i] = aiPlayer;
                let score = minimax(state, depth + 1, false, aiPlayer);
                state[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 1; i <= 9; i++) {
            if (state[i] === '') {
                state[i] = opponent;
                let score = minimax(state, depth + 1, true, aiPlayer);
                state[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Checks if there's a winner or draw on the given state (minimax)
function checkWinner(state) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a]; // returns 'x' or 'o'
        }
    }
    if (!state.includes('')) { // no empty state left
        return 'draw';
    }
    return null; // game not finished
}
