import { generateRandomBetweenZeroAndX } from "../../../constants";
import { adaptToAvailabilityMatrix, instantiateMove } from "./Scramble";
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
    const axisCount = availabilityMatrix.length;
    const layerCount = availabilityMatrix[0].length;
    let turnIterator;
    let scramble = threeScramble(availabilityMatrix);
    availabilityMatrix.forEach(tuple => {
        tuple.pop();
    });
    let move = { axis: null, layer: null };
    if (0 !== generateRandomBetweenZeroAndX(6)) {
        move = instantiateMove(axisCount, layerCount);
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        const moveAxis = move.axis;
        for (let i = 0; i < availabilityMatrix[moveAxis].length; i++) {
            availabilityMatrix[moveAxis][i] = false;
        }
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[moveAxis][move.layer][turnIterator];
    }
    if (0 !== generateRandomBetweenZeroAndX(4)) {
        move = instantiateMove(axisCount, layerCount);
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += LAST_TWO[move.axis][move.layer][turnIterator];
    }
    return scramble;
};
