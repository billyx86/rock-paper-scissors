let playerScore = 0;
let computerScore = 0;

// DOM

const playerRock = document.getElementById("rock");
const playerPaper = document.getElementById("paper");
const playerScissors = document.getElementById("scissors");

playerRock.addEventListener('click', function () {
    game("rock");
});
playerPaper.addEventListener('click', function () {
    game("paper");
});
playerScissors.addEventListener('click', function () {
    game("scissors");
});

// main code

function getComputerChoice() {
    var choices = ["rock", "paper", "scissors"]
    return(choices[Math.floor(Math.random()*choices.length)]);
}

function resultOut(win, playerSelection, computerSelection) {
    if(win == true) {
        console.log("You win!", playerSelection, "beats", computerSelection);
    } else {
        console.log("You lost!", computerSelection, "beats", playerSelection);
    }
}

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    if(playerSelection === computerSelection) {
        console.log("You tied! You both had", playerSelection);
    } else if((playerSelection == "rock" && computerSelection == "scissors") || (playerSelection == "scissors" && computerSelection == "rock")) {
        playerSelection == "rock" ? (playerScore++, resultOut(1, playerSelection, computerSelection)) : (computerScore++, resultOut(0, playerSelection, computerSelection));
    } else if((playerSelection == "scissors" && computerSelection == "paper") || (playerSelection == "paper" && computerSelection == "scissors")) {
        playerSelection == "scissors" ? (playerScore++, resultOut(1, playerSelection, computerSelection)) : (computerScore++, resultOut(0, playerSelection, computerSelection));
    }  else if((playerSelection == "paper" && computerSelection == "rock") || (playerSelection == "rock" && computerSelection == "paper")) {
        playerSelection == "paper" ? (playerScore++, resultOut(1, playerSelection, computerSelection)): (computerScore++, resultOut(0, playerSelection, computerSelection));
    }
}

function game(playerSelection) {
    playRound(playerSelection, getComputerChoice());

    /*if(playerScore > computerScore) {
        console.log("You win with a score of", playerScore);
    } else if(playerScore == computerScore) {
        console.log("You tied with a score of", playerScore);
    } else {
        console.log("You lost with a score of", playerScore);
    }*/
}
