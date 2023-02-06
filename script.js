function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getComputerChoice() {
    let random = getRandomInt(3);
    
    if(random === 0) {
        return("Rock");
    } else if(random === 1) {
        return("Paper");
    } else if(random === 2) {
        return("Scissors");
    }
}