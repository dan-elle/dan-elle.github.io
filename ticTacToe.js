// constants for all of the parts of the game board
//creating an array of cells
const cells = document.querySelectorAll('[data-cell]')
const cellsArray = Array.from(cells);
const cellRow1 = cellsArray.slice(0, 3)
const cellRow2 = cellsArray.slice(3, 6)
const cellRow3 = cellsArray.slice(6, 9)
const boardArray = [cellRow1, cellRow2, cellRow3]

const board = document.getElementById('board')

//winning page
const winningMessageTextElement = document.querySelector('[data-win-message-text]')
const winningMessageElement = document.getElementById('winMessage')
const restartButton = document.getElementById('restartButton')

// buttons for piece choices at game start
const xButton = document.getElementById('xButton')
const oButton = document.getElementById('oButton')
const playerPieceChoice = document.getElementById('playerPieceChoice')

// variables
const xClass = 'x'
const oClass = 'o'
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
let oTurn

let playerPiece
let playerTurn
let computerPiece

// start the game
start()

//add function to the start button
restartButton.addEventListener('click', start)

//functions


function start() {
    //reset all the variables upon starting the game to create a clean gameboard
    oTurn = false
    winningMessageElement.classList.remove('show')
    playerPieceChoice.classList.add('show')
    cells.forEach(cell => {
        cell.classList.remove(xClass)
        cell.classList.remove(oClass)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    xButton.addEventListener('click', chooseX)
    oButton.addEventListener('click', chooseO)
}

//choosing piece functions
function chooseX() {
    playerPiece = xClass
    computerPiece = oClass
    playerTurn = true
    playerPieceChoice.classList.remove('show')
    setBoardHover()
}

function chooseO() {
    playerPiece = oClass
    computerPiece = xClass
    playerTurn = false
    playerPieceChoice.classList.remove('show')
    let computerMove = computerPlay()
    console.log("playing at", computerMove);
    placeMark(cells[computerMove], computerPiece)
    swapTurns()
    setBoardHover()
}

//what to do when a cell is clicked (event listener callback fn)
function handleClick(event) {
    const cell = event.target
    const currentClass = oTurn ? oClass : xClass
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        if (!playerTurn) {
            let computerMove = computerPlay()
            console.log("playing at", computerMove);
            placeMark(cells[computerMove], computerPiece)
            if (checkWin(computerPiece)) {
                endGame(false)
            } else if (isDraw()) {
                endGame(true)
            } else {
                swapTurns()
            }
        }
        setBoardHover()
    }
}

//place the gamepieces
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

//switch turns each round
function swapTurns() {
    oTurn = !oTurn
    playerTurn = !playerTurn
}

//show the player when hovering over a valid cell
function setBoardHover() {
    board.classList.remove(xClass)
    board.classList.remove(oClass)
    if (playerTurn) {
        if (oTurn) {
            board.classList.add(oClass)
        } else {
            board.classList.add(xClass)
        }
    }
}

//check if any winner exists
function checkWin(currentClass) {
    return winningCombos.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass)
        })
    })
}

//check for a draw
function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(xClass) || cell.classList.contains(oClass)
    })
}

//end the game based on whether there is a winner or draw
function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw! Try again!'
    }
    else {
        winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function computerPlay() {
    console.log("Computing move...");
    let currentBestPlace
    let currentBestLength = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            console.log("Loop iteration:", i, j);
            if (cells[i * 3 + j].classList.contains(computerPiece)) {
                //move directionally through the board
                for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
                    for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
                        let tempi = i + deltaX
                        let tempj = j + deltaY
                        //piece out of bounds or not moved
                        if (tempi < 0 || tempi > 2 || tempj < 0 || tempj > 2 || (deltaX === 0 && deltaY === 0)) {
                            continue
                        }
                        //check if the adjacent spot has computer piece
                        if (cells[tempi * 3 + tempj].classList.contains(computerPiece)) {
                            if (!cells[tempi * 3 + tempj + 1].classList.contains(xClass) && !cells[tempi * 3 + tempj + 1].classList.contains(oClass)) {
                                console.log("Found computer piece at:", i, j);
                                return tempi * 3 + tempj + 1
                            }
                        }
                    }
                }
            }
        }
    }
    //if not returned at this point, no winning move exists, play random move
    let randomMove = Math.floor(Math.random() * 9)
    while (cells[randomMove].classList.contains(xClass) || cells[randomMove].classList.contains(oClass)) {
        randomMove = Math.floor(Math.random() * 9)
    }
    console.log("didn't find winning move, playing random move:", randomMove);
    return randomMove
}