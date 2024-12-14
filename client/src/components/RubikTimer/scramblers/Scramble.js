import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import * as constants from "../../../constants";
import { generateRandomBetweenZeroAndX } from "../../../constants";
import { Scramble as bldScrambler } from "./bldScrambler";
import { Scramble as clockScrambler } from "./clockScrambler";
import { Scramble as fiveScrambler } from "./fiveScrambler";
import { Scramble as fmcScrambler } from "./fmcScrambler";
import { Scramble as fourScrambler } from "./fourScrambler";
import { Scramble as megaScrambler } from "./megaScrambler";
import { Scramble as pyraminxScrambler } from "./pyraScrambler";
import { Scramble as sevenScrambler } from "./sevenScrambler";
import { Scramble as sixScrambler } from "./sixScrambler";
import { Scramble as skewbScrambler } from "./skewbScrambler";
import { Scramble as threeScrambler } from "./threeScrambler";
import { Scramble as twoScrambler } from "./twoScrambler";

const Scramble = ({ isNewScramble, onScrambleChange, puzzle, display, quantity }) => {
    const [scramble, setScramble] = useState("");

    useEffect(() => {
        if (isNewScramble && display === "block") {
            let newScramble;
            switch (puzzle) {
                case constants.THREE:
                    newScramble = threeScrambler().trim();
                    break;
                case constants.TWO:
                    newScramble = twoScrambler().trim();
                    break;
                case constants.FOUR:
                    newScramble = fourScrambler().trim();
                    break;
                case constants.FIVE:
                    newScramble = fiveScrambler().trim();
                    break;
                case constants.SEVEN:
                    newScramble = sevenScrambler().trim();
                    break;
                case constants.SIX:
                    newScramble = sixScrambler().trim();
                    break;
                case constants.BLD:
                    newScramble = bldScrambler().trim();
                    break;
                case constants.FMC:
                    newScramble = fmcScrambler().trim();
                    break;
                case constants.OH:
                    newScramble = threeScrambler().trim();
                    break;
                case constants.CLOCK:
                    newScramble = clockScrambler().trim();
                    break;
                case constants.MEGAMINX:
                    newScramble = megaScrambler().trim();
                    break;
                case constants.PYRAMINX:
                    newScramble = pyraminxScrambler().trim();
                    break;
                case constants.SKEWB:
                    newScramble = skewbScrambler().trim();
                    break;
                case constants.SQUARE:
                    newScramble = "not implemented";
                    break;
                case constants.FOUR_BLD:
                    newScramble = "not implemented";
                    break;
                case constants.FIVE_BLD:
                    newScramble = "not implemented";
                    break;
                case constants.MULTI: {
                    let multiScrambles = [];
                    for (let i = 0; i < quantity; i++) {
                        multiScrambles.push(bldScrambler().trim());
                    }
                    newScramble = multiScrambles.map((scramble, index) => (
                        <p key={index}>{index + 1}{")"} {scramble}</p>
                    ));
                    break;
                }
                default:
                    newScramble = "";
            }
            setScramble(newScramble);
            onScrambleChange(newScramble);
        }
    }, [display, isNewScramble, onScrambleChange, puzzle, quantity]);

    return (
        <h2 data-testid="scramble" className={puzzle} style={{ display: display }}>{scramble}</h2>
    );
};

export const SCRAMBLE_MOVES = [[
    ["D ", "D2 ", "D' "],
    ["U ", "U2 ", "U' "],
    ["Dw ", "Dw2 ", "Dw' "],
    ["Uw ", "Uw2 ", "Uw' "],
    ["3Dw ", "3Dw2 ", "3Dw' "],
    ["3Uw ", "3Uw2 ", "3Uw' "],
], [
    ["B ", "B2 ", "B' "],
    ["F ", "F2 ", "F' "],
    ["Bw ", "Bw2 ", "Bw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["3Bw ", "3Bw2 ", "3Bw' "],
    ["3Fw ", "3Fw2 ", "3Fw' "],
], [
    ["L ", "L2 ", "L' "],
    ["R ", "R2 ", "R' "],
    ["Lw ", "Lw2 ", "Lw' "],
    ["Rw ", "Rw2 ", "Rw' "],
    ["3Lw ", "3Lw2 ", "3Lw' "],
    ["3Rw ", "3Rw2 ", "3Rw' "],
]];

export const instantiateMove = (axis, layers, width = null) => {
    let axisIdx = generateRandomBetweenZeroAndX(axis);
    let layerIdx = width !== null
        ? width * 2 + generateRandomBetweenZeroAndX(2)
        : generateRandomBetweenZeroAndX(layers);
    return {
        axis: axisIdx,
        layer: layerIdx
    };
};

export const adaptToAvailabilityMatrix = (matrix, move, axisCount) => {
    for (let i = 0; i < axisCount; i++) {
        for (let j = 0; j < 2; j++) {
            if (matrix[move.axis][move.layer]) {
                return;
            }
            move.layer = move.layer % 2 === 0 ? move.layer + 1 : move.layer - 1;
        }
        move.axis = ++move.axis % axisCount;
    }
    console.log("ERROR: could not find a valid move");
    return;
};

export const invalidateMoves = (matrix, move, previous) => {
    matrix[move.axis][move.layer] = false;
    if (previous) {
        const previousAxis = previous.axis;
        if (previousAxis !== move.axis) {
            for (let i = 0; i < matrix[previousAxis].length; i++) {
                matrix[previousAxis][i] = true;
            }
        }
    }
    return;
};

Scramble.propTypes = {
    isNewScramble: PropTypes.bool,
    onScrambleChange: PropTypes.func,
    puzzle: PropTypes.string,
    display: PropTypes.string,
    quantity: PropTypes.number
};

export default Scramble;
