import { generateRandomBetweenZeroAndX } from "../../../constants";
import { adaptToAvailabilityMatrix, instantiateMove } from "./Scramble";
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
    const axisCount = availabilityMatrix.length;
    const layerCount = availabilityMatrix[0].length;
    let turnIterator;
    let scramble = fourScrambler();
    let move = { axis: null, layer: null };
    if (0 !== generateRandomBetweenZeroAndX(6)) {
        move = instantiateMove(axisCount, layerCount);
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        const moveAxis = move.axis;
        availabilityMatrix[moveAxis][0] = false;
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
