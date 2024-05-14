// constants for all of the parts of the game board
const cells = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageTextElement = document.querySelector('[data-win-message-text]')
const winningMessageElement = document.getElementById('winMessage')
const restartButton = document.getElementById('restartButton')

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

// start the game
start()

//add function to the start button
restartButton.addEventListener('click', start)

//functions

//reset all the variables upon starting the game to create a clean gameboard
function start() {
    winningMessageElement.classList.remove('show')
    oTurn = false
    cells.forEach(cell => {
        cell.classList.remove(xClass)
        cell.classList.remove(oClass)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
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
}

//show the player when hovering over a valid cell
function setBoardHover() {
    board.classList.remove(xClass)
    board.classList.remove(oClass)
    if (oTurn) {
        board.classList.add(oClass)
    } else {
        board.classList.add(xClass)
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