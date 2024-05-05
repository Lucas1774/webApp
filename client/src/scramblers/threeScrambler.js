export const SCRAMBLE_LENGTH = 20;
const SCRAMBLE_MOVES = [
    ["U ", "U2 ", "U' "],
    ["D ", "D2 ", "D' "],
    ["F ", "F2 ", "F' "],
    ["B ", "B2 ", "B' "],
    ["R ", "R2 ", "R' "],
    ["L ", "L2 ", "L' "],
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -1;
    let secondToLastMoveIndex = -1;
    let turnLayer, turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        if (0 === i) {
            turnLayer = Math.floor(Math.random() * 6);
        }
        else if (1 === i || parseInt(lastMoveIndex / 2) !== parseInt(secondToLastMoveIndex / 2)) {
            turnLayer = Math.floor(Math.random() * 5);
            if (turnLayer === lastMoveIndex) {
                turnLayer = (turnLayer + 1) % 6
            }
        }
        else {
            turnLayer = Math.floor(Math.random() * 4);
            if (turnLayer === lastMoveIndex || turnLayer === secondToLastMoveIndex) {
                if (turnLayer % 2 === 0) {
                    turnLayer = (turnLayer + 2) % 6;
                } else {
                    turnLayer = (turnLayer + 1) % 6;
                }
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
        secondToLastMoveIndex = lastMoveIndex;
        lastMoveIndex = turnLayer;
    }
    return scramble;
}
