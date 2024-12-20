import { generateRandomBetweenZeroAndX } from "../../../constants";
import { generateMove } from "./Scramble";
import {
    Scramble as threeScramble
} from "./threeScrambler";

const LAST_TWO = [[
    ["Uw ", "Uw2 ", "Uw' "],
], [
    ["Fw ", "Fw2 ", "Fw' "],
], [
    ["Rw ", "Rw2 ", "Rw' "],
]];

export const Scramble = () => {
    let availabilityMatrix = [[true, true], [true, true], [true, true]];
    let turnIterator;
    let scramble = threeScramble(availabilityMatrix);
    availabilityMatrix.forEach(tuple => {
        tuple.pop();
    });
    let move = { axis: null, layer: null };
    let hasFirst = false;
    if (0 !== generateRandomBetweenZeroAndX(6)) {
        move = generateMove(availabilityMatrix);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer][turnIterator];
        hasFirst = true;
    }
    if (0 !== generateRandomBetweenZeroAndX(4)) {
        if (hasFirst) {
            updateAvailabilityMatrix(availabilityMatrix, move.axis);
        }
        move = generateMove(availabilityMatrix);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer][turnIterator];
    }
    return scramble;
};

const updateAvailabilityMatrix = (matrix, moveAxis) => {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i][0] = i !== moveAxis;
    }
};
