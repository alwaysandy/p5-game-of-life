class Tile {
  constructor(x, y, index_x, index_y, alive) {
    this.x = x;
    this.y = y;
    this.index_x = index_x;
    this.index_y = index_y;
    this.alive = alive;
  }

  show() {
    strokeWeight(1);
    if (this.alive) {
      fill(0);
    } else {
      fill(255);
    }
    square(this.x, this.y, SQUARE_SIZE);
  }
}

let keep_running = false;

const grid = [];
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const CANVAS_SIZE = 600;
const SQUARE_SIZE = CANVAS_SIZE / GRID_WIDTH;

const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];
const UPLEFT = [-1, -1];
const UPRIGHT = [1, -1];
const DOWNLEFT = [-1, 1];
const DOWNRIGHT = [1, 1];
const directions = [UP, DOWN, LEFT, RIGHT, UPLEFT, UPRIGHT, DOWNLEFT, DOWNRIGHT];

const livingCells = new Set();

for (let i = 0; i < GRID_HEIGHT; i++) {
  grid.push([]);
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      grid[i].push(new Tile(i*SQUARE_SIZE, j*SQUARE_SIZE, i, j, false));
    }
  }
}

function updateTiles() {
  let deadCells = [];
  let deadNeighbours = new Map();
  for (let t of livingCells) {
    let neighbours = 0;
    for (let d of directions) {
      let n_x = t.index_x + d[0];
      let n_y = t.index_y + d[1];
      if (n_x < 0 || n_x >= GRID_WIDTH) {
        continue;
      }

      if (n_y < 0 || n_y >= GRID_HEIGHT) {
        continue;
      }

      if (grid[n_x][n_y].alive) {
        neighbours += 1;
      } else {
        let nnCount = deadNeighbours.get(grid[n_x][n_y]);
        if (!nnCount) {
          deadNeighbours.set(grid[n_x][n_y], 1);
        } else {
          deadNeighbours.set(grid[n_x][n_y], nnCount + 1);
        }
      }
    }

    if (neighbours < 2 || neighbours > 3) {
      deadCells.push(t);
    }
  }

  for (let t of deadCells) {
    t.alive = false;
    livingCells.delete(t);
  }

  for (const [cell, neighbours] of deadNeighbours) {
    if (neighbours == 3) {
      cell.alive = true;
      livingCells.add(cell);
    }
  }
}

function mousePressed() {
  x = floor(mouseX / SQUARE_SIZE);
  y = floor(mouseY / SQUARE_SIZE);

  if (x > GRID_WIDTH || y > GRID_HEIGHT || x < 0 || y < 0) {
    return;
  }

  let cell = grid[x][y];
  cell.alive = !cell.alive;
  if (cell.alive) {
    livingCells.add(cell);
  } else {
    livingCells.delete(cell);
  }
}

function keyPressed() {
  if (key === ' ') {
    keep_running = !keep_running;
  }
}

function draw() {
  frameRate(10);
  background(220);

  for (let row of grid) {
    for (let t of row) {
      t.show();
    }
  }

  if (keep_running) {
    updateTiles();
  }
}