function getComputerChoice() {
    random = Math.getRandomInt(3)
    
    if(random === 0) {
        return("Rock");
    } else if(random === 1) {
        return("Paper")
    } else if(random === 2) {
        return("Scissors")
    }
}

