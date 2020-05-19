function createBlockType(color, grid) {
  return () => ({color, grid})
}

export const blockTypes = {
  straight: createBlockType('blue',
    [
      [1, 1, 1, 1]
    ]
  ),
  lshape: createBlockType('darkblue',
    [
      [1, 0, 0],
      [1, 1, 1]
    ]
  ),
  reverselShape: createBlockType('orange',
    [
      [0, 0, 1],
      [1, 1, 1]
    ]
  ),
  square: createBlockType('yellow',
    [
      [1, 1],
      [1, 1]
    ]
  ),
  squiggle: createBlockType('green',
    [
      [0, 1, 1],
      [1, 1, 0]
    ]
  ),
  reverseSquiggle: createBlockType('red',
    [
      [1, 1, 0],
      [0, 1, 1]
    ]
  ),
  key: createBlockType('purple',
    [
      [0, 1, 0],
      [1, 1, 1]
    ]
  ),
}

export function rotate(blockGrid) {
  const blockHeight = blockGrid.length
  const blockWidth = blockGrid[0].length

  const newGrid = []
  for (let x = blockWidth - 1; x >= 0; x--) {
    const line = []
    for (let y = 0; y < blockHeight; y++) {
      const cell = blockGrid[y][x]
      line.push(cell)
    }
    newGrid.push(line)
  }
  return newGrid
}

function rotateRandomly(blockType) {
  const rotations = Math.floor(Math.random() * 4)
  
  for (let r = 0; r <= rotations; r++) {
    blockType.grid = rotate(blockType.grid)
  }

  return blockType
}

export function chooseBlock() {
  const allTypes = Object.keys(blockTypes)
  const randomIndex = Math.floor(Math.random() * allTypes.length)
  const randomKey = allTypes[randomIndex]
  const randomBlock = blockTypes[randomKey]()
  const rotatedBlock = rotateRandomly(randomBlock)
  return rotatedBlock
}
