const myCanvas = document.getElementById("myCanvas");
myCanvas.width = 500;
myCanvas.height = 300;
const margin = 35;
const n = 10;
const array = [];
const cols = [];
const spacing = (myCanvas.width - margin * 3) / n;
const ctx = myCanvas.getContext("2d");
const maxColumnHeight = 300;
let moves = [];
let paused = false;
let sortingName = "";
document.getElementById("bubble-sort-info").style.display = "none";
document.getElementById("insertion-sort-info").style.display = "none";
document.getElementById("selection-sort-info").style.display = "none";

document.getElementById("stopButton").onclick = () => {
    paused = !paused;
    if (paused) {
        document.getElementById("stopButton").textContent = "Continue Sorting";
    } else {
        document.getElementById("stopButton").textContent = "Stop Sorting";
        animate();
    }
};
document.getElementById("randomButton").onclick = () => {
    document.getElementById("bubble-sort-info").style.display = "none";
    document.getElementById("insertion-sort-info").style.display = "none";
    document.getElementById("stopButton").textContent = "Stop Sorting";
    init();
};

document.getElementById("bubbleSortButton").onclick = () => {
    sortingName = "bubbleSort";
    play();
    document.getElementById("insertion-sort-info").style.display = "none";
    document.getElementById("selection-sort-info").style.display = "none";
    document.getElementById("bubble-sort-info").style.display = "table-row";
};
document.getElementById("insertionSortButton").onclick = () => {
    sortingName = "insertionSort";
    play();
    document.getElementById("bubble-sort-info").style.display = "none";
    document.getElementById("selection-sort-info").style.display = "none";
    document.getElementById("insertion-sort-info").style.display = "table-row";
};
document.getElementById("selectionSortButton").onclick = () => {
    sortingName = "selectionSort";
    play();
    document.getElementById("bubble-sort-info").style.display = "none";
    document.getElementById("insertion-sort-info").style.display = "none";
    document.getElementById("selection-sort-info").style.display = "table-row";
};
function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    moves = [];
    for (let i = 0; i < array.length; i++) {
        const x = i * spacing + spacing / 2 + margin;
        const y = myCanvas.height - margin - i * 0.5;
        const width = spacing - 4;
        const height = maxColumnHeight * array[i];
        cols[i] = new Column(x, y, width, height);
    }
}

function play() {
    if (sortingName == "bubbleSort") {
        moves = bubbleSort(array);
    }
    else if (sortingName == "selectionSort") {
        moves = selectionSort(array);
    }
    else {
        moves = insertionSort(array);
    }
}
animate();
function bubbleSort(array) {
    const moves = [];
    moves.push({ indices: [0, 0], swap: false, changeColour: false });
    for (let i = 0; i < array.length - 1; i++) {
        let swapped = false;
        for (let j = 1; j < array.length - i; j++) {
            if (array[j - 1] >= array[j]) {
                swapped = true;
                [array[j - 1], array[j]] = [array[j], array[j - 1]];
                moves.push({ indices: [j - 1, j], swap: true, changeColour: false });
            } else {
                moves.push({ indices: [j - 1, j], swap: false, changeColour: false });
            }
        }
        moves.push({ indices: [array.length - i - 1], swap: false, changeColour: true, color: "green" });
    }
    moves.push({ indices: [0, 0], swap: false, changeColour: true, color: "green" });
    return moves;
}

function insertionSort(array) {
    const moves = [];
    moves.push({ indices: [0], swap: false, changeColour: true, color: "green" });
    for (let i = 1; i < array.length; i++) {
        let temp = array[i];
        let j = i - 1;
        while (j >= 0 && temp <= array[j]) {
            array[j + 1] = array[j];
            moves.push({ indices: [j, j + 1], swap: true, changeColour: false });
            moves.push({ indices: [j, j + 1], swap: false, changeColour: true, color: "green" });
            moves.push({ indices: [j + 1,], swap: false, changeColour: true, color: "green" });
            j--;
        }
        if (j == i - 1) {
            moves.push({ indices: [i, i], swap: true, changeColour: false });
        }
        array[j + 1] = temp;
        moves.push({ indices: [j + 1], swap: false, changeColour: true, color: "green" });
    }
    return moves;
}
function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        moves.push({ indices: [i], swap: false, changeColour: true, color: "yellow" });
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [minIndex, j], swap: false, changeColour: false });
            if (array[j] < array[minIndex]) {
                moves.push({ indices: [minIndex], swap: false, changeColour: true, color: "default" });
                minIndex = j;
                moves.push({ indices: [minIndex], swap: false, changeColour: true, color: "yellow" });
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            moves.push({ indices: [i, minIndex], swap: true, changeColour: false });
        }
        moves.push({ indices: [i, minIndex], swap: false, changeColour: true, color: "green" });
    }
    console.log(array);
    return moves;
}
function animate() {
    if (paused) return;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    let changed = false;
    for (let i = 0; i < cols.length; i++) {
        changed = cols[i].draw(ctx) || changed;
    }
    if (!changed && moves.length > 0) {
        const move = moves.shift();
        const [i, j] = move.indices;
        if (move.swap == false && move.changeColour == false) {
            cols[j].jump();
        }
        if (move.changeColour == true && move.swap == false) {
            let color = [150, 150, 150];
            if (move.color == "yellow") {
                color = [255, 255, 0];
            }
            if (move.color == "green") {
                color = [0, 255, 100];
            }
            cols[i].changeColourOfElement(...color);
        }
        if (move.swap == true && move.changeColour == false) {
            cols[i].moveTo(cols[j]);
            cols[j].moveTo(cols[i], -1);
            [cols[i], cols[j]] = [cols[j], cols[i]];
        }
    }
    requestAnimationFrame(animate);
}
