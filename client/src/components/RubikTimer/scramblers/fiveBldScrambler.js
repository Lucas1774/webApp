import { generateRandomBetweenZeroAndX } from "../../../constants";
import { generateMove } from "./Scramble";
import {
    Scramble as fiveScramble
} from "./fiveScrambler";

const LAST_TWO = [[
    ["3Uw ", "3Uw2 ", "3Uw' "],
], [
    ["3Fw ", "3Fw2 ", "3Fw' "],
], [
    ["3Rw ", "3Rw2 ", "3Rw' "],
]];

export const Scramble = () => {
    let availabilityMatrix = [[true, true, true, true], [true, true, true, true], [true, true, true, true]];
    let turnIterator;
    let scramble = fiveScramble(availabilityMatrix);
    availabilityMatrix.forEach(tuple => {
        tuple.pop();
    });
    let move = { axis: null, layer: null };
    let hasFirst = false;
    if (0 !== generateRandomBetweenZeroAndX(6)) {
        move = generateMove(availabilityMatrix, 1); // Effectively a wide move
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer % 2][turnIterator]; // Normalize layer
        hasFirst = true;
    }
    if (0 !== generateRandomBetweenZeroAndX(3)) {
        if (hasFirst) {
            updateAvailabilityMatrix(availabilityMatrix, move.axis);
        }
        move = generateMove(availabilityMatrix, 1); // Effectively a wide move
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer % 2][turnIterator]; // Normalize layer
    }
    return scramble;
};

const updateAvailabilityMatrix = (matrix, moveAxis) => {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i][2] = i !== moveAxis;
    }
};
