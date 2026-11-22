let playerScore = 0;
let computerScore = 0;

// DOM

const playerRock = document.getElementById("rock");
const playerPaper = document.getElementById("paper");
const playerScissors = document.getElementById("scissors");
const resetButton = document.getElementById("reset");

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

resetButton.addEventListener('click', function () {
    resultOut.textContent = "";
    scoreDiv.textContent = "";
    playerScore = 0;
    computerScore = 0;
});

// Keyboard controls: R/P/S throw, Backspace resets (#6). The key is
// routed through the real button's click handler so the game-over lock
// and all round logic apply exactly as they do for mouse clicks.
const keyMap = {
    "r": "rock",
    "p": "paper",
    "s": "scissors",
    "backspace": "reset",
};

document.addEventListener("keydown", function (event) {
    // Ignore modifier combos (browser shortcuts, find-in-page, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const id = keyMap[event.key.toLowerCase()];
    const button = id ? document.getElementById(id) : null;
    if (button) button.click();
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
        return `You win! ${capitaliseFirstLetter(playerSelection)} beats ${computerSelection}.`;
    } else {
        return `You lost! ${capitaliseFirstLetter(computerSelection)} beats ${playerSelection}.`;
    }
}

// Returns the round's outcome text without touching the DOM (#7): the
// caller writes result-out exactly once per round so the aria-live
// region announces one message per round, never two.
function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    if(playerSelection === computerSelection) {
        return `You tied! You both had ${playerSelection}.`;
    } else if((playerSelection == "rock" && computerSelection == "scissors") || (playerSelection == "scissors" && computerSelection == "rock")) {
        if (playerSelection == "rock") { playerScore++; } else { computerScore++; }
        return outputResult(playerSelection == "rock", playerSelection, computerSelection);
    } else if((playerSelection == "scissors" && computerSelection == "paper") || (playerSelection == "paper" && computerSelection == "scissors")) {
        if (playerSelection == "scissors") { playerScore++; } else { computerScore++; }
        return outputResult(playerSelection == "scissors", playerSelection, computerSelection);
    } else {
        if (playerSelection == "paper") { playerScore++; } else { computerScore++; }
        return outputResult(playerSelection == "paper", playerSelection, computerSelection);
    }
}

function game(playerSelection) {
    const roundMessage = playRound(playerSelection, getComputerChoice());
    scoreDiv.textContent = `You: ${playerScore}, Computer: ${computerScore}`;
    // Single, last write to result-out each round (#7): the match-over
    // message wins over the round result so screen readers announce
    // exactly one message.
    let finalMessage = roundMessage;
    if(playerScore == 5) {
        finalMessage = "You win! Congratulations.";
    } else if(computerScore == 5) {
        finalMessage = "The computer wins!";
    }
    resultOut.textContent = finalMessage;
}