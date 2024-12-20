import { generateRandomBetweenZeroAndX } from "../../../constants";
import { generateMove, updateAvailabilityMatrix } from "./Scramble";
export const SCRAMBLE_LENGTH = 11;
const SCRAMBLE_MOVES = [
    [["U ", "U' "]],
    [["B ", "B' "]],
    [["R ", "R' "]],
    [["L ", "L' "]]
];

export const Scramble = () => {
    let availabilityMatrix = [[true], [true], [true], [true]];
    let turnIterator;
    let scramble = "";
    let move = { axis: null, layer: null };
    let previous;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        move = generateMove(availabilityMatrix);
        updateAvailabilityMatrix(availabilityMatrix, move, previous);
        turnIterator = generateRandomBetweenZeroAndX(2);
        scramble += SCRAMBLE_MOVES[move.axis][move.layer][turnIterator];
        previous = { ...move };
    }
    return scramble;
};
