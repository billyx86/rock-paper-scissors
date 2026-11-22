# rock-paper-scissors
A Rock Paper Scissors game written in JavaScript, with a simple terminal-like movie-hacker style theme.

Play with the mouse, or entirely from the keyboard: **R** / **P** / **S** throw rock, paper or scissors, and **Backspace** resets the match. The buttons keep a visible focus outline so keyboard play is obvious.

The font used is [VT323 by Peter Hull](https://fonts.google.com/specimen/VT323).

Special thanks to [The Odin Project](https://www.theodinproject.com/) for allowing me to develop the skills I've needed to create this project.

## Tests

The game logic and the HTML/CSS a11y properties are covered by plain
`node --test` suites (no dependencies, Node 22):

    npm test

The suites drive the real `index.html`/`script.js` against a minimal
in-memory DOM and assert the live-region behaviour (one announcement
per round), the keyboard keymap, the game-over lock and the absence of
stray visible text around the buttons.