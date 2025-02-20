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

const grid = [];
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
const CANVAS_SIZE = 400;
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

for (let i = 0; i < GRID_HEIGHT; i++) {
  grid.push([]);
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      grid[i].push(new Tile(i*SQUARE_SIZE, j*SQUARE_SIZE, j, i, false));
    }
  }
}

function updateTiles() {
  let to_update = [];
  for (let row of grid) {
    for (let t of row) {
      let neighbours = 0;
      for (let d of directions) {
        if (t.index_x + d[0] < 0 || t.index_x + d[0] >= GRID_WIDTH) {
          continue;
        }

        if (t.index_y + d[1] < 0 || t.index_y + d[1] >= GRID_HEIGHT) {
          continue;
        }

        if (grid[t.index_y + d[1]][t.index_x + d[0]].alive) {
          neighbours += 1;
        }
      }

      if (t.alive) {
        console.log(neighbours);
      }

      if (t.alive && (neighbours < 2 || neighbours > 3)) {
        to_update.push({tile: t, alive: false});
      } else if (t.alive == false && neighbours == 3) {
        to_update.push({tile: t, alive: true});
      }
    }
  }

  for (let t of to_update) {
    t.tile.alive = t.alive;
  }
}

function mousePressed() {
  x = floor(mouseX / SQUARE_SIZE);
  y = floor(mouseY / SQUARE_SIZE);

  if (x > CANVAS_SIZE || y > CANVAS_SIZE || x < 0 || y < 0) {
    return;
  } 

  grid[x][y].alive =  !grid[x][y].alive;
}

function keyPressed() {
  updateTiles();
}

function draw() {
  background(220);

  for (let row of grid) {
    for (let t of row) {
      t.show();
    }
  }
}