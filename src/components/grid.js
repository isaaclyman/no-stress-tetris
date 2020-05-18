const width = 12
const height = 18

const grid = []
for (let h = 1; h <= height; h++) {
  const line = []
  for (let w = 1; w <= width; w++) {
    line.push(0)
  }
  grid.push(line)
}

export default grid