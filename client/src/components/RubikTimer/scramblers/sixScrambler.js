import { generateRandomBetweenZeroAndX } from "../../../constants";
import { adaptToAvailabilityMatrix, instantiateMove, invalidateMoves, SCRAMBLE_MOVES } from "./Scramble";

export const SCRAMBLE_LENGTH = 80;

export const Scramble = () => {
    let availabilityMatrix = [[true, true, true, true, true], [true, true, true, true, true], [true, true, true, true, true]];
    const axisCount = availabilityMatrix.length;
    const layerCount = availabilityMatrix[0].length;
    let turnIterator;
    let scramble = "";
    let move = { axis: null, layer: null };
    let previous;
    let width;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        width = generateRandomBetweenZeroAndX(5);
        if (width !== 4) {
            width = Math.floor(width / 2)
        } else {
            width = 2;
        }
        move = instantiateMove(axisCount, layerCount, width);
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        invalidateMoves(availabilityMatrix, move, previous);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
        previous = { ...move };
    }
    return scramble;
};
