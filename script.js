let playerScore = 0;
let computerScore = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getComputerChoice() {
    let random = getRandomInt(3);
    
    if(random === 0) {
        return("rock");
    } else if(random === 1) {
        return("paper");
    } else if(random === 2) {
        return("scissors");
    }
}

function resultOut(win, playerSelection, computerSelection) {
    if(win == true) {
        console.log("You win! " + playerSelection + " beats " + computerSelection);
    } else {
        console.log("You lost! " + computerSelection + " beats " + playerSelection);
    }
}

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    if(playerSelection === computerSelection) {
        playerScore++;
        computerScore++;
        console.log("You tied! You both had ", playerSelection);
    } else if((playerSelection == "rock" && computerSelection == "scissors") || (playerSelection == "scissors" && computerSelection == "rock")) {
        playerSelection == "rock" ? (playerScore++, resultOut(1, playerSelection, computerSelection)) : (computerScore++, resultOut(0, playerSelection, computerSelection));
    } else if((playerSelection == "scissors" && computerSelection == "paper") || (playerSelection == "paper" && computerSelection == "scissors")) {
        playerSelection == "scissors" ? (playerScore++, resultOut(1, playerSelection, computerSelection)) : (computerScore++, resultOut(0, playerSelection, computerSelection));
    }  else if((playerSelection == "paper" && computerSelection == "rock") || (playerSelection == "rock" && computerSelection == "paper")) {
        playerSelection == "paper" ? (playerScore++, resultOut(1, playerSelection, computerSelection)): (computerScore++, resultOut(0, playerSelection, computerSelection));
    }
}
