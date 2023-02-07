let playerScore = 0;
let computerScore = 0;

// DOM

const playerRock = document.getElementById("rock");
const playerPaper = document.getElementById("paper");
const playerScissors = document.getElementById("scissors");

const scoreDiv = document.getElementById("score");
const resultOut = document.getElementById("result-out")

playerRock.addEventListener('click', function () {
    if (!(playerScore == 5 || computerScore == 5)) game("rock");
});
playerPaper.addEventListener('click', function () {
    if (!(playerScore == 5 || computerScore == 5)) game("paper");
});
playerScissors.addEventListener('click', function () {
    if (!(playerScore == 5 || computerScore == 5)) game("scissors");
});

// main code

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function getComputerChoice() {
    var choices = ["rock", "paper", "scissors"]
    return(choices[Math.floor(Math.random()*choices.length)]);
}

function outputResult(win, playerSelection, computerSelection) {
    if(win == true) {
        resultOut.textContent = `You win! ${capitaliseFirstLetter(playerSelection)} beats ${computerSelection}.`;
    } else {
        resultOut.textContent = `You lost! ${capitaliseFirstLetter(computerSelection)} beats ${playerSelection}.`;
    }
}

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    if(playerSelection === computerSelection) {
        resultOut.textContent = `You tied! You both had ${playerSelection}.`;
    } else if((playerSelection == "rock" && computerSelection == "scissors") || (playerSelection == "scissors" && computerSelection == "rock")) {
        playerSelection == "rock" ? (playerScore++, outputResult(1, playerSelection, computerSelection)) : (computerScore++, outputResult(0, playerSelection, computerSelection));
    } else if((playerSelection == "scissors" && computerSelection == "paper") || (playerSelection == "paper" && computerSelection == "scissors")) {
        playerSelection == "scissors" ? (playerScore++, outputResult(1, playerSelection, computerSelection)) : (computerScore++, outputResult(0, playerSelection, computerSelection));
    }  else if((playerSelection == "paper" && computerSelection == "rock") || (playerSelection == "rock" && computerSelection == "paper")) {
        playerSelection == "paper" ? (playerScore++, outputResult(1, playerSelection, computerSelection)): (computerScore++, outputResult(0, playerSelection, computerSelection));
    }
}

function game(playerSelection) {
    playRound(playerSelection, getComputerChoice());
    scoreDiv.textContent = `You: ${playerScore}, Computer: ${computerScore}`;
    if(playerScore == 5)  {
        resultOut.textContent = "You win! Congratulations."
    } else if(computerScore == 5) {
        resultOut.textContent = "The computer wins!"
    }
}