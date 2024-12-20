import { generateRandomBetweenZeroAndX } from "../../../constants";
import { generateMove } from "./Scramble";
import {
    Scramble as fourScrambler
} from "./fourScrambler";

const LAST_TWO = [[
    ["x ", "x2 ", "x' "],
], [
    ["y ", "y2 ", "y' "],
], [
    ["z ", "z2 ", "z' "],
]];

export const Scramble = () => {
    let availabilityMatrix = [[true], [true], [true]];
    let turnIterator;
    let scramble = fourScrambler();
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
    matrix[moveAxis][0] = false;
};
