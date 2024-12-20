import { generateRandomBetweenZeroAndX } from "../../../constants";
import { SCRAMBLE_MOVES, generateMove, updateAvailabilityMatrix } from "./Scramble";

export const SCRAMBLE_LENGTH = 21;

export const Scramble = (availabilityMatrix = null) => {
    if (!availabilityMatrix) {
        availabilityMatrix = [[true, true], [true, true], [true, true]];
    }
    let turnIterator;
    let scramble = "";
    let move = { axis: null, layer: null };
    let previous;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        move = generateMove(availabilityMatrix);
        updateAvailabilityMatrix(availabilityMatrix, move, previous);
        turnIterator = generateRandomBetweenZeroAndX(3);
        scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
        previous = { ...move };
    }
    return scramble;
};
