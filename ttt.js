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
            var item = moves[Math.floor(Math.random()*moves.length)];
            determineWinner();
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
function celebrate() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
