import './style.css'
import { BLOCK_SIZE, BOARD_HEIGHt, BOARD_WIDTH, EVENT_MOVEMENTS } from './const'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const $score = document.querySelector('span')

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHt

context.scale(BLOCK_SIZE, BLOCK_SIZE)

let score = 0

// 1. Board
const board = createBorad(BOARD_WIDTH, BOARD_HEIGHt)

function createBorad(width, height){
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 2. Piece player
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1]
  ]
]

// 2. Game loop
/*function update()
{
  draw()
  window.requestAnimationFrame(update)
}*/

// Auto drop
let dropCounter = 0
let lastTime = 0

function update(time = 0)
{
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if(dropCounter > 500){
    piece.position.y++
    dropCounter = 0

    if(checkColliction()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw()
{
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value == 1){
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value == 1){
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', event => {
  if(event.key == EVENT_MOVEMENTS.LEFT){
    piece.position.x--
    if(checkColliction()){
      piece.position.x++
    }
  }
  if(event.key == EVENT_MOVEMENTS.RIGHT){
    piece.position.x++
    if(checkColliction()){
      piece.position.x--
    }
  }
  if(event.key == EVENT_MOVEMENTS.DOWN){
    piece.position.y++
    if(checkColliction()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  if(event.key == EVENT_MOVEMENTS.UP){
    const rotated = []
    for(let i = 0; i < piece.shape[0].length; i++){
      const row = []
      for(let j = piece.shape.length - 1; j >= 0; j--){
        row.push(piece.shape[j][i])
      }

      rotated.push(row)
    }
    const previousShape = piece.shape
    piece.shape         = rotated
    if(checkColliction()){
      piece.shape = previousShape
    }
  }
})

function checkColliction(){
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value != 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] != 0
      )
    })
  })
}

function solidifyPiece()
{
  piece.shape.find((row, y) => {
    row.find((value, x) => {
      if(value == 1){
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  // Reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0

  // Get Random Shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if(checkColliction()){
    window.alert('Game Over!! Sorry')
    board.forEach((row) => row.fill(0))
  }
}

function removeRows()
{
  const rowsToRemove = []

  board.forEach((row, y) => {
    if(row.every(value => value == 1)){
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
  update()
  $section.remove()
  const audio = new Audio('./Tetris.mp3')
  audio.volume = 0.5
  audio.play()
})