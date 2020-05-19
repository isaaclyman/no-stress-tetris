function createBlockType(color, grid) {
  return {color, grid}
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

export function chooseBlock() {
  const allTypes = Object.keys(blockTypes)
  const randomIndex = Math.floor(Math.random() * allTypes.length)
  const randomKey = allTypes[randomIndex]
  return blockTypes[randomKey]
}
