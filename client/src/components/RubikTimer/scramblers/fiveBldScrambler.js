import { generateRandomBetweenZeroAndX } from "../../../constants";
import { adaptToAvailabilityMatrix, instantiateMove } from "./Scramble";
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
    const axisCount = availabilityMatrix.length;
    const layerCount = availabilityMatrix[0].length;
    let turnIterator;
    let scramble = fiveScramble(availabilityMatrix);
    availabilityMatrix.forEach(tuple => {
        tuple.pop();
    });
    let move = { axis: null, layer: null };
    if (0 !== generateRandomBetweenZeroAndX(6)) {
        move = instantiateMove(axisCount, layerCount, 1); // Effectively a wide move
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        const moveAxis = move.axis;
        for (let i = 0; i < availabilityMatrix[moveAxis].length; i++) {
            availabilityMatrix[moveAxis][i] = false;
        }
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[moveAxis][move.layer % 2][turnIterator]; // Normalize layer
    }
    if (0 !== generateRandomBetweenZeroAndX(3)) {
        move = instantiateMove(axisCount, layerCount, 1); // Effectively a wide move
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer % 2][turnIterator]; // Normalize layer
    }
    return scramble;
};
