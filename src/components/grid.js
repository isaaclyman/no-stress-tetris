const width = 12
const height = 18

function makeGrid() {
  const grid = []
  for (let h = 1; h <= height; h++) {
    const line = []
    for (let w = 1; w <= width; w++) {
      line.push(0)
    }
    grid.push(line)
  }
  return grid
}

export function isSettled(grid) {
  for (let lIndex = 0; lIndex < grid.length; lIndex++) {
    const line = grid[lIndex]
    for (let cIndex = 0; cIndex < line.length; cIndex++) {
      if (!isCellSettled(grid, lIndex, cIndex)) {
        return false
      }
    }
  }
  return true
}

function isCellSettled(grid, lineIndex, cellIndex) {
  const cell = grid[lineIndex][cellIndex]
  if (!cell) {
    return true
  }

  if (lineIndex >= grid.length - 1) {
    return true
  }

  const downOneCell = grid[lineIndex + 1][cellIndex]
  if (downOneCell) {
    return true
  }

  return false
}

export function exertGravity(grid) {
  const hypotheticalGrid = makeGrid()

  for (let lIndex = grid.length - 1; lIndex >= 0; lIndex--) {
    const line = grid[lIndex]
    for (let cIndex = 0; cIndex < line.length; cIndex++) {
      const cell = line[cIndex]
      if (!cell) {
        continue
      }

      if (lIndex === grid.length - 1) {
        hypotheticalGrid[lIndex].splice(cIndex, 1, 1)
        continue
      }

      let downOneCell = hypotheticalGrid[lIndex + 1][cIndex]
      if (downOneCell) {
        hypotheticalGrid[lIndex].splice(cIndex, 1, 1)
      } else {
        hypotheticalGrid[lIndex + 1].splice(cIndex, 1, 1)
      }
    }
  }

  for (let lIndex = 0; lIndex < grid.length; lIndex++) {
    const line = grid[lIndex]
    for (let cIndex = 0; cIndex < line.length; cIndex++) {
      grid[lIndex].splice(cIndex, 1, hypotheticalGrid[lIndex][cIndex])
    }
  }
}

export function createBlock(grid, block) {
  const blockHeight = block.grid.length
  const blockWidth = block.grid[0].length
  const availableCoordinate = findSpace(grid, blockWidth, blockHeight)

  if (availableCoordinate.some(c => c === -1)) {
    return false
  }

  const [y, x] = availableCoordinate

  for (let lIndex = 0; lIndex < blockHeight; lIndex++) {
    for (let cIndex = 0; cIndex < blockWidth; cIndex++) {
      grid[lIndex + y].splice(cIndex + x, 1, block.grid[y][x])
    }
  }

  return true
}

function findSpace(grid, width, height) {
  for (let lIndex = 0; lIndex < grid.length; lIndex++) {
    const line = grid[lIndex]
    for (let cIndex = 0; cIndex < line.length; cIndex++) {
      const cell = line[cIndex]
      if (cell) {
        continue
      }

      if (isThereSpace(grid, lIndex, cIndex, width, height)) {
        return [lIndex, cIndex]
      }
    }
  }
  return [-1, -1]
}

function isThereSpace(grid, lIndex, cIndex, width, height) {
  for (let y = 0; y < height; y++) {
    if (lIndex + y >= grid.length) {
      return false
    }

    const line = grid[lIndex + y]
    for (let x = 0; x < width; x++) {
      if (cIndex + x >= line.length) {
        return false
      }

      const cell = grid[lIndex + y][cIndex + x]
      if (cell) {
        return false
      }
    }
  }

  return true
}

const grid = makeGrid()
export default grid