import { generateRandomBetweenZeroAndX } from "../../../constants";
import { adaptToAvailabilityMatrix, instantiateMove, invalidateMoves, SCRAMBLE_MOVES } from "./Scramble";
import {
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH
} from "./threeScrambler";

export const FMC_PREFIX = "R' U' F "
export const SCRAMBLE_LENGTH = THREE_SCRAMBLE_LENGTH + ((FMC_PREFIX.trim().split(" ").length) * 2);

export const Scramble = () => {
    let scramble = FMC_PREFIX;
    let availabilityMatrix = [[true, true], [true, false], [true, true]];
    const axisCount = availabilityMatrix.length;
    const layerCount = availabilityMatrix[0].length;
    let turnIterator;
    let move = { axis: null, layer: null };
    let previous;
    for (let i = 0; i < THREE_SCRAMBLE_LENGTH - 1; i++) {
        move = instantiateMove(axisCount, layerCount);
        adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
        invalidateMoves(availabilityMatrix, move, previous);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
        previous = { ...move };
    }
    availabilityMatrix[2][1] = false; // invalidate R
    if (previous.axis === 2) { // invalidate L as well
        availabilityMatrix[2][0] = false;
    }
    move = instantiateMove(axisCount, layerCount);
    adaptToAvailabilityMatrix(availabilityMatrix, move, axisCount);
    invalidateMoves(availabilityMatrix, move, previous);
    turnIterator = generateRandomBetweenZeroAndX(3);
    scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
    scramble += FMC_PREFIX;
    return scramble;
};
