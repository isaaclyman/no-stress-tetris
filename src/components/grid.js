import { rotate } from './block'

const width = 12
const height = 18

function defaultValue() {
  return {
    hasBlock: 0,
    color: null
  }
}

function makeGrid() {
  const grid = []
  for (let h = 1; h <= height; h++) {
    grid.push(makeLine())
  }
  return grid
}

function makeLine() {
  const line = []
  for (let w = 1; w <= width; w++) {
    line.push(defaultValue())
  }
  return line;
}

class Grid {
  constructor() {
    this.currentBlock = {
      blockType: null,
      coordinates: [-1, -1],
      hasTouchedBottom: false
    }

    this.grid = makeGrid()
  }

  isSettled() {
    for (let lIndex = 0; lIndex < this.grid.length; lIndex++) {
      const line = this.grid[lIndex]
      for (let cIndex = 0; cIndex < line.length; cIndex++) {
        if (!this.isCellSettled(lIndex, cIndex)) {
          return false
        }
      }
    }
    return true
  }

  isCellSettled(lIndex, cIndex) {
    const cell = this.grid[lIndex][cIndex]
    if (!cell.hasBlock) {
      return true
    }
  
    if (lIndex >= this.grid.length - 1) {
      return true
    }
  
    const downOneCell = this.grid[lIndex + 1][cIndex]
    if (downOneCell.hasBlock) {
      return true
    }
  
    return false
  }

  exertGravity() {
    const hypotheticalGrid = makeGrid()

    for (let lIndex = this.grid.length - 1; lIndex >= 0; lIndex--) {
      const line = this.grid[lIndex]
      for (let cIndex = 0; cIndex < line.length; cIndex++) {
        const cell = line[cIndex]
        if (!cell.hasBlock) {
          continue
        }

        const currentBlockRelativeY = lIndex - this.currentBlock.coordinates[0]
        const currentBlockRelativeX = cIndex - this.currentBlock.coordinates[1]
        const currentBlockLine = this.currentBlock.blockType.grid[currentBlockRelativeY]
        const isCurrentBlock = currentBlockLine && currentBlockLine[currentBlockRelativeX]
  
        if (lIndex === this.grid.length - 1) {
          if (isCurrentBlock) {
            this.currentBlock.hasTouchedBottom = true
          }
          hypotheticalGrid[lIndex].splice(cIndex, 1, cell)
          continue
        }
  
        let downOneCell = hypotheticalGrid[lIndex + 1][cIndex]
        if (downOneCell.hasBlock) {
          if (isCurrentBlock) {
            this.currentBlock.hasTouchedBottom = true
          }
          hypotheticalGrid[lIndex].splice(cIndex, 1, cell)
        } else {
          hypotheticalGrid[lIndex + 1].splice(cIndex, 1, cell)
        }
      }
    }
  
    if (!this.currentBlock.hasTouchedBottom) {
      this.currentBlock.coordinates[0] += 1
    }
  
    for (let lIndex = 0; lIndex < this.grid.length; lIndex++) {
      const line = this.grid[lIndex]
      for (let cIndex = 0; cIndex < line.length; cIndex++) {
        this.grid[lIndex].splice(cIndex, 1, hypotheticalGrid[lIndex][cIndex])
      }
    }
  }

  createBlock(block) {
    const blockHeight = block.grid.length
    const blockWidth = block.grid[0].length
    const availableCoordinate = this.findSpace(blockWidth, blockHeight)
  
    if (availableCoordinate.some(c => c === -1)) {
      return false
    }
  
    const [y, x] = availableCoordinate
  
    for (let lIndex = 0; lIndex < blockHeight; lIndex++) {
      for (let cIndex = 0; cIndex < blockWidth; cIndex++) {
        this.grid[lIndex + y].splice(cIndex + x, 1, {
          hasBlock: block.grid[lIndex][cIndex],
          color: block.color
        })
      }
    }
  
    this.currentBlock = {
      blockType: block,
      coordinates: [y, x],
      hasTouchedBottom: false
    }
  
    return true
  }

  findSpace(width, height) {
    const line = this.grid[0]

    const center = Math.round((line.length / 2) - (width / 2))
    if (isThereSpace(this.grid, 0, center, width, height)) {
      return [0, center]
    }
  
    for (let cIndex = 0; cIndex < line.length; cIndex++) {
      const cell = line[cIndex]
      if (cell.hasBlock) {
        continue
      }
  
      if (isThereSpace(this.grid, 0, cIndex, width, height)) {
        return [0, cIndex]
      }
    }
    return [-1, -1]
  }

  getLineClears() {
    const clears = []

    for (let lIndex = 0; lIndex < this.grid.length; lIndex++) {
      const line = this.grid[lIndex]
      if (line.every(cell => cell.hasBlock)) {
        clears.push(lIndex)
      }
    }
  
    return clears
  }

  clearLines(clears, callback) {
    for (const lIndex of clears) {
      this.grid.splice(lIndex, 1, makeLine())
    }
  
    this.forceSettle(callback)
  }

  forceSettle(callback) {
    setTimeout(() => {
      this.exertGravity()
      if (!this.isSettled()) {
        this.forceSettle(callback)
      } else {
        if (callback) {
          callback()
        }
      }
    }, 50)
  }

  moveCurrentBlockLeft() {
    if (this.currentBlock.hasTouchedBottom) {
      return false
    }

    const blockHeight = this.currentBlock.blockType.grid.length
    const blockWidth = this.currentBlock.blockType.grid[0].length

    if (!isThereSpace(
      this.getGridWithoutCurrentBlock(), 
      this.currentBlock.coordinates[0], 
      this.currentBlock.coordinates[1] - 1, 
      blockWidth, 
      blockHeight
    )) {
      return false;
    }

    for (let y = 0; y < blockHeight; y++) {
      const line = this.grid[this.currentBlock.coordinates[0] + y];
      for (let x = 0; x < blockWidth; x++) {
        const currentPosition = this.currentBlock.coordinates[1] + x
        line.splice(currentPosition, 1, defaultValue())
        const nextPosition = currentPosition - 1
        line.splice(nextPosition, 1, {
          hasBlock: this.currentBlock.blockType.grid[y][x],
          color: this.currentBlock.blockType.color
        })
      }
    }

    this.currentBlock.coordinates[1] -= 1

    return true
  }

  moveCurrentBlockRight() {
    if (this.currentBlock.hasTouchedBottom) {
      return false
    }

    const blockHeight = this.currentBlock.blockType.grid.length
    const blockWidth = this.currentBlock.blockType.grid[0].length
  
    if (!isThereSpace(
      this.getGridWithoutCurrentBlock(),
      this.currentBlock.coordinates[0],
      this.currentBlock.coordinates[1] + 1,
      blockWidth,
      blockHeight
    )) {
      return false;
    }
  
    for (let y = 0; y < blockHeight; y++) {
      const line = this.grid[this.currentBlock.coordinates[0] + y];
      for (let x = blockWidth - 1; x >= 0; x--) {
        const currentPosition = this.currentBlock.coordinates[1] + x
        line.splice(currentPosition, 1, defaultValue())
        const nextPosition = currentPosition + 1
        line.splice(nextPosition, 1, {
          hasBlock: this.currentBlock.blockType.grid[y][x],
          color: this.currentBlock.blockType.color
        })
      }
    }
  
    this.currentBlock.coordinates[1] += 1
  
    return true
  }

  rotateCurrentBlock() {
    if (this.currentBlock.hasTouchedBottom) {
      return false
    }

    const blockHeight = this.currentBlock.blockType.grid.length
    const blockWidth = this.currentBlock.blockType.grid[0].length
  
    const rotation = rotate(this.currentBlock.blockType.grid)
    const rotationHeight = rotation.length
    const rotationWidth = rotation[0].length
    
    if (!isThereSpace(
      this.getGridWithoutCurrentBlock(),
      this.currentBlock.coordinates[0],
      this.currentBlock.coordinates[1], 
      rotationWidth, 
      rotationHeight
    )) {
      return false
    }
  
    // Erase current block
    for (let y = 0; y < blockHeight; y++) {
      const line = this.grid[this.currentBlock.coordinates[0] + y]
      for (let x = 0; x < blockWidth; x++) {
        line.splice(this.currentBlock.coordinates[1] + x, 1, defaultValue())
      }
    }
  
    // Add rotated block
    for (let y = 0; y < rotationHeight; y++) {
      const line = this.grid[this.currentBlock.coordinates[0] + y]
      for (let x = 0; x < rotationWidth; x++) {
        line.splice(this.currentBlock.coordinates[1] + x, 1, {
          hasBlock: rotation[y][x] ? 1 : 0,
          color: this.currentBlock.blockType.color
        })
      }
    }
    
    this.currentBlock.blockType.grid = rotation
  
    return true
  }

  getGridWithoutCurrentBlock() {
    const hypotheticalGrid = this.grid.map(line => line.map(cell => ({...cell})))
    const blockHeight = this.currentBlock.blockType.grid.length
    const blockWidth = this.currentBlock.blockType.grid[0].length
  
    for (let y = 0; y < blockHeight; y++) {
      const line = hypotheticalGrid[this.currentBlock.coordinates[0] + y]
      for (let x = 0; x < blockWidth; x++) {
        const hasCurrentBlock = this.currentBlock.blockType.grid[y][x]
  
        if (hasCurrentBlock) {
          line.splice(this.currentBlock.coordinates[1] + x, 1, defaultValue())
        }
      }
    }
  
    return hypotheticalGrid
  }
}


function isThereSpace(grid, lIndex, cIndex, width, height) {
  if (lIndex < 0 || cIndex < 0) {
    return false
  }

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
      if (cell.hasBlock) {
        return false
      }
    }
  }

  return true
}

const grid = new Grid()
export default grid