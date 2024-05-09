
import { render } from '@testing-library/react';
import Scramble from "./scramblers/provider";
import { EMPTY_TIMER, TWO, THREE, FOUR, BLD } from "./constants";
import { SCRAMBLE_LENGTH as TWO_SCRAMBLE_LENGTH } from "./scramblers/twoScrambler";
import { SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH } from "./scramblers/threeScrambler";
import { SCRAMBLE_LENGTH as FOUR_SCRAMBLE_LENGTH } from "./scramblers/fourScrambler";
import { SCRAMBLE_LENGTH as BLD_SCRAMBLE_LENGTH } from "./scramblers/bldScrambler";

const isTimerRunning = false;
const isTimerPrepared = false;
const isHorizontal = false;
const averageDisplay = isTimerRunning || isTimerPrepared ? "none" : "grid";

test("2x2", () => {
	for (let i = 0; i < 1000; i++) {
		const scramble = Scramble(TWO);
		console.log(scramble);
		const axisMoves = scramble.split(" ")
			.map(move => move[0])
			.join("");
		console.log(axisMoves);
		expect(axisMoves.length).toBe(TWO_SCRAMBLE_LENGTH);
		expect(axisMoves).not.toContain("UU");
		expect(axisMoves).not.toContain("FF");
		expect(axisMoves).not.toContain("RR");
	}
});

test("3x3", () => {
	for (let i = 0; i < 1000; i++) {
		const scramble = Scramble(THREE);
		console.log(scramble);
		const axisMoves = scramble.split(" ")
			.map(move => move[0])
			.join("");
		console.log(axisMoves);
		expect(axisMoves.length).toBe(THREE_SCRAMBLE_LENGTH);
		expect(axisMoves).not.toContain("UU");
		expect(axisMoves).not.toContain("DD");
		expect(axisMoves).not.toContain("FF");
		expect(axisMoves).not.toContain("BB");
		expect(axisMoves).not.toContain("RR");
		expect(axisMoves).not.toContain("LL");
		expect(axisMoves).not.toContain("UDU");
		expect(axisMoves).not.toContain("DUD");
		expect(axisMoves).not.toContain("FBF");
		expect(axisMoves).not.toContain("BFB");
		expect(axisMoves).not.toContain("RLR");
		expect(axisMoves).not.toContain("LRL");
	}
});

test("BLD", () => {
	for (let i = 0; i < 1000; i++) {
		const scramble = Scramble(BLD);
		console.log(scramble);
		const axisMoves = scramble.split(" ")
			.map(move => move[0])
			.join("");
		console.log(axisMoves);
		expect(axisMoves.length).toBe(BLD_SCRAMBLE_LENGTH);
		const nonWideAxisMoves = axisMoves.substring(0, axisMoves.length - 2);
		expect(nonWideAxisMoves).not.toContain("UU");
		expect(nonWideAxisMoves).not.toContain("DD");
		expect(nonWideAxisMoves).not.toContain("FF");
		expect(nonWideAxisMoves).not.toContain("BB");
		expect(nonWideAxisMoves).not.toContain("RR");
		expect(nonWideAxisMoves).not.toContain("LL");
		expect(nonWideAxisMoves).not.toContain("UDU");
		expect(nonWideAxisMoves).not.toContain("DUD");
		expect(nonWideAxisMoves).not.toContain("FBF");
		expect(nonWideAxisMoves).not.toContain("BFB");
		expect(nonWideAxisMoves).not.toContain("RLR");
		expect(nonWideAxisMoves).not.toContain("LRL");
		const secondAndThirdLastMoves = axisMoves.substring(axisMoves.length - 3, axisMoves.length - 1);
		expect(secondAndThirdLastMoves).not.toBe("UD");
		expect(secondAndThirdLastMoves).not.toBe("DU");
		expect(secondAndThirdLastMoves).not.toBe("FB");
		expect(secondAndThirdLastMoves).not.toBe("BF");
		expect(secondAndThirdLastMoves).not.toBe("RL");
		expect(secondAndThirdLastMoves).not.toBe("LR");
		const lastTwoMoves = axisMoves.substring(axisMoves.length - 2);
		expect(lastTwoMoves).not.toBe("UU");
		expect(lastTwoMoves).not.toBe("UD");
		expect(lastTwoMoves).not.toBe("DU");
		expect(lastTwoMoves).not.toBe("DD");
		expect(lastTwoMoves).not.toBe("FF");
		expect(lastTwoMoves).not.toBe("FB");
		expect(lastTwoMoves).not.toBe("BF");
		expect(lastTwoMoves).not.toBe("BB");
		expect(lastTwoMoves).not.toBe("RR");
		expect(lastTwoMoves).not.toBe("RL");
		expect(lastTwoMoves).not.toBe("LR");
		expect(lastTwoMoves).not.toBe("LL");
	}
});

test("4x4", () => {
	for (let i = 0; i < 1000; i++) {
		const scramble = Scramble(FOUR);
		console.log(scramble);
		const axisMoves = scramble.replace(/['2]/g, "");
		console.log(axisMoves);
		const completelyRawMoves = axisMoves.replace(/[w\s]/g, "");
		console.log(completelyRawMoves);
		expect(completelyRawMoves.length).toBe(FOUR_SCRAMBLE_LENGTH);
		expect(axisMoves).not.toContain("U U ");
		expect(axisMoves).not.toContain("D D ");
		expect(axisMoves).not.toContain("F F ");
		expect(axisMoves).not.toContain("B B ");
		expect(axisMoves).not.toContain("R R ");
		expect(axisMoves).not.toContain("L L ");
		expect(axisMoves).not.toContain("U D U ");
		expect(axisMoves).not.toContain("D U D ");
		expect(axisMoves).not.toContain("F B F ");
		expect(axisMoves).not.toContain("B F B ");
		expect(axisMoves).not.toContain("R L R ");
		expect(axisMoves).not.toContain("L R L ");
		expect(axisMoves).not.toContain("Uw Uw ");
		expect(axisMoves).not.toContain("Dw Dw ");
		expect(axisMoves).not.toContain("Fw Fw ");
		expect(axisMoves).not.toContain("Bw Bw ");
		expect(axisMoves).not.toContain("Rw Rw ");
		expect(axisMoves).not.toContain("Lw Lw ");
		expect(axisMoves).not.toContain("Uw D Uw ");
		expect(axisMoves).not.toContain("Uw U Uw ");
		expect(axisMoves).not.toContain("Dw D Dw ");
		expect(axisMoves).not.toContain("Dw U Dw ");
		expect(axisMoves).not.toContain("Fw B Fw ");
		expect(axisMoves).not.toContain("Fw F Fw ");
		expect(axisMoves).not.toContain("Bw F Bw ");
		expect(axisMoves).not.toContain("Bw B Bw ");
		expect(axisMoves).not.toContain("Rw L Rw ");
		expect(axisMoves).not.toContain("Rw R Rw ");
	}
});

const renderAverages = (recentTimes) => { // mocking the function like this is an approach I can live with
	const params = [
		{ label: "best", length: 1, removeBestAndWorst: false, align: "left" },
		{ label: "mo3", length: 3, removeBestAndWorst: false, align: "left" },
		{ label: "avg5", length: 5, removeBestAndWorst: true, align: "left" },
		{ label: "avg12", length: 12, removeBestAndWorst: true, align: isHorizontal ? "left" : "right" },
		{ label: "mo50", length: 50, removeBestAndWorst: false, align: "right" },
		{ label: "mo100", length: 100, removeBestAndWorst: false, align: "right" },
	];
	return (
		<div className="background" style={{ display: averageDisplay }}>
			{params.map(({ label, length, removeBestAndWorst, align }) => {
				let displayTime = EMPTY_TIMER;
				if (removeBestAndWorst) {
					if (recentTimes.length === length - 1) { // 4/5, 11/12 -> make average without best
						displayTime = formatTime(recentTimes.sort((a, b) => a - b)
							.slice(1)
							.reduce((sum, time) => sum + time, 0) / (length - 2));
					} else if (recentTimes.length >= length) { // otherwise -> make average without best and worst
						displayTime = formatTime(recentTimes.slice(-length)
							.sort((a, b) => a - b)
							.slice(1, -1)
							.reduce((sum, time) => sum + time, 0) / (length - 2));
					}
				} else if (recentTimes.length >= length) {
					if (length === 1) { // best -> pick
						displayTime = formatTime(Math.min(...recentTimes));
					} else { // otherwise -> make mean
						displayTime = formatTime(recentTimes.slice(-length)
							.reduce((sum, time) => sum + time, 0) / length);
					}
				}
				return (
					<h4 style={{ textAlign: align }}>{align === "left" ? label + " " + displayTime : displayTime + " " + label}</h4>
				);
			})}
		</div>
	);
}
const formatTime = (time) => {
	const minutes = parseInt(Math.floor(time / 60000)).toString();
	const seconds = parseInt(Math.floor((time % 60000) / 1000)).toString().padStart(2, '0');
	const milliseconds = parseInt((time % 1000)).toString().padStart(3, '0');
	return `${minutes}:${seconds}:${milliseconds}`;
}

test("Render Averages", () => {
	let recentTimes = [484, 148567, 4847, 61874, 848975, 1877894, 157, 87974, 4876, 15879, 189687, 489751, 48976, 487, 7888];
	const { container } = render(renderAverages(recentTimes));
	expect(container.innerHTML).toContain('best 0:00:157');
	expect(container.innerHTML).toContain('mo3 0:19:117');
	expect(container.innerHTML).toContain('avg5 1:22:183');
	expect(container.innerHTML).toContain('2:55:636 avg12');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo50');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo100');
});

test("Render incomplete averages", () => {
	const recentTimes = [148567, 484, 4847, 61874];
	const { container } = render(renderAverages(recentTimes));
	expect(container.innerHTML).toContain('best 0:00:484');
	expect(container.innerHTML).toContain('mo3 0:22:401');
	expect(container.innerHTML).toContain('avg5 1:11:762');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' avg12');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo50');
	expect(container.innerHTML).toContain(EMPTY_TIMER + ' mo100');
});
