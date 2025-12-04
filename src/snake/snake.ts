const FPS = 5;
const DEBUG = false;
const DEFAULT_SNAKE_LENGTH = 5;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

console.log(canvas.getBoundingClientRect());

if (!ctx) {
  throw new Error("Impossible d'obtenir le contexte 2D");
}

console.log(
  canvas.clientWidth,
  canvas.clientHeight,
  canvas.width,
  canvas.height
);

let snake: {
  pos: {
    x: number;
    y: number;
  };
  direction: {
    x: number;
    y: number;
  };
  length: number;
  queue: { x: number; y: number }[];
};

const snakeSize = 25;
const cellsCount = 13;
const speed = snakeSize;

let apple: { x: number; y: number };
let score = 0;

const setBestScore = (newScore: number) => {
  localStorage.setItem("snakeScore", newScore.toString());
}

const getBestScore = (): number => {
  const score = localStorage.getItem("snakeScore");
  if (score) {
    return parseInt(score, 10);
  }
  return 0;
}

const hasQueueTouchedItself = () => {
  const head = snake.queue[snake.queue.length - 1];
  for (let i = 0; i < snake.queue.length - 1; i++) {
    const segment = snake.queue[i];
    if (head.x === segment.x && head.y === segment.y) {
      console.log(i, head, segment);
      return true;
    }
  }
  return false;
};

const hasBorderBeenTouched = () => {
  if (
    snake.pos.x < 0 ||
    snake.pos.x + snakeSize >= canvas.width - 1 ||
    snake.pos.y < 0 ||
    snake.pos.y + snakeSize >= canvas.height - 1
  ) {
    return true;
  }
  return false;
};

const createNewApple = () => {
  apple = {
    x: Math.floor(Math.random() * cellsCount) * snakeSize,
    y: Math.floor(Math.random() * cellsCount) * snakeSize,
  };
  if (snake.queue.some(segment => segment.x === apple.x && segment.y === apple.y)) {
    createNewApple();
  }
}

const displayScore = () => {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`;
  }
}

/**
 * Dessine le fond en damier
 * Très très très peu optimisé mais pas ltemps
 */
const drawBackground = () => {
  const hexColors = ["#617b97ff", "#394856ff"];
  let index = 0;
  let x = 0;
  let y = 0;

  ctx.fillStyle = hexColors[index];
  while (x < canvas.width) {
    while (y < canvas.height) {
      ctx.fillRect(x, y, snakeSize, snakeSize);
      y += snakeSize;
      index = (index + 1) % hexColors.length;
      ctx.fillStyle = hexColors[index];
      //console.log(x, y, index);
    }
    x += snakeSize;
    y = 0;
  }
};

const resize = () => {
  canvas.width = cellsCount * snakeSize;
  canvas.height = cellsCount * snakeSize;

  drawBackground();
};

const setup = () => {
  snake = {
    pos: {
      x: (Math.floor(cellsCount / 2) - 1) * snakeSize,
      y: Math.floor(cellsCount / 2) * snakeSize,
    },
    direction: {
      x: 1,
      y: 0,
    },
    length: DEFAULT_SNAKE_LENGTH,
    queue: [],
  };
  score = 0;
  createNewApple();
};

const game = () => {
  if (DEBUG) console.table(Object.entries(snake));

  if (hasQueueTouchedItself()) {
    alert(`Tu t'est mordu la queue !\nTon score : ${score}\nMeilleur score : ${getBestScore()}`);
    if (score > getBestScore()) {
      setBestScore(score);
    }
    setup();
  }

  if (hasBorderBeenTouched()) {
    alert(`Tu as touché la bordure !\nTon score : ${score}\nMeilleur score : ${getBestScore()}`);
    if (score > getBestScore()) {
      setBestScore(score);
    }
    setup();
  }

  snake.pos.x += snake.direction.x * speed;
  snake.pos.y += snake.direction.y * speed;

  if (snake.pos.x === apple.x && snake.pos.y === apple.y) {
    score += 1;
    snake.length = score + DEFAULT_SNAKE_LENGTH;
    createNewApple();
  }

  // Effacer le canvas
  drawBackground();

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, snakeSize, snakeSize);

  ctx.fillStyle = "lime";
  ctx.fillRect(snake.pos.x, snake.pos.y, snakeSize, snakeSize);

  snake.queue.push({ x: snake.pos.x, y: snake.pos.y });
  while (snake.queue.length > snake.length) {
    snake.queue.shift();
  }

  ctx.fillStyle = "lime";
  snake.queue.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
  });
  displayScore()
};

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      console.log("up");
      snake.direction.x = 0;
      snake.direction.y = -1;
      break;
    case "ArrowDown":
      console.log("down");
      snake.direction.x = 0;
      snake.direction.y = 1;
      break;
    case "ArrowLeft":
      console.log("left");
      snake.direction.x = -1;
      snake.direction.y = 0;
      break;
    case "ArrowRight":
      console.log("right");
      snake.direction.x = 1;
      snake.direction.y = 0;
      break;
  }
});

resize();
window.addEventListener("resize", resize);

setup();
const interval = setInterval(game, 1000 / FPS);
