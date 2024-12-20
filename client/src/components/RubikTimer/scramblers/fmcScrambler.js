import { generateRandomBetweenZeroAndX } from "../../../constants";
import { generateMove, SCRAMBLE_MOVES, updateAvailabilityMatrix } from "./Scramble";
import {
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH
} from "./threeScrambler";

export const FMC_PREFIX = "R' U' F "
export const SCRAMBLE_LENGTH = THREE_SCRAMBLE_LENGTH + ((FMC_PREFIX.trim().split(" ").length) * 2);

export const Scramble = () => {
    let scramble = FMC_PREFIX;
    let availabilityMatrix = [[true, true], [true, false], [true, true]];
    let turnIterator;
    let move = { axis: null, layer: null };
    let previous;
    for (let i = 0; i < THREE_SCRAMBLE_LENGTH - 1; i++) {
        move = generateMove(availabilityMatrix);
        updateAvailabilityMatrix(availabilityMatrix, move, previous);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
        previous = { ...move };
    }
    availabilityMatrix[2][1] = false; // invalidate R
    if (previous.axis === 2) { // invalidate L as well
        availabilityMatrix[2][0] = false;
    }
    move = generateMove(availabilityMatrix);
    turnIterator = generateRandomBetweenZeroAndX(3);
    scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
    scramble += FMC_PREFIX;
    return scramble;
};
