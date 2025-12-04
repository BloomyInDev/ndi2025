const DEBUG = false;
const DEFAULT_SNAKE_LENGTH = 5;
const DEFAULT_FPS = 5;
const MILLISECONDS_BETWEEN_SPEED_INCREASE = 1000 * .5;

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

let fps = DEFAULT_FPS;
const snakeSize = 25;
const cellsCount = 11;
const speed = snakeSize;
let gameInterval: number | null = null;
let speedInterval: number | null = null;

let apple: { x: number; y: number };
let score = 0;

const setBestScore = (newScore: number) => {
  localStorage.setItem("snakeScore", newScore.toString());
};

const getBestScore = (): number => {
  const score = localStorage.getItem("snakeScore");
  if (score) {
    return parseInt(score, 10);
  }
  return 0;
};

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
  if (
    snake.queue.some(
      (segment) => segment.x === apple.x && segment.y === apple.y
    )
  ) {
    createNewApple();
  }
};

const displayScore = () => {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score} | Meilleur score: ${getBestScore()} | Vitesse: ${fps} FPS`;
  }
};

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
  fps = DEFAULT_FPS;
  createNewApple();
  launchIntervals();
};

const launchIntervals = () => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  if (speedInterval) {
    clearInterval(speedInterval);
  }
  gameInterval = setInterval(game, 1000 / fps);
  speedInterval = setInterval(() => {
    fps += 1;
    updateGameInterval();
  }, MILLISECONDS_BETWEEN_SPEED_INCREASE);
};

const updateGameInterval = () => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(game, 1000 / fps);
};

const game = () => {
  if (DEBUG) console.table(Object.entries(snake));

  if (hasQueueTouchedItself()) {
    alert(
      `Tu t'est mordu la queue !\nTon score : ${score}\nMeilleur score : ${getBestScore()}`
    );
    if (score > getBestScore()) {
      setBestScore(score);
    }
    setup();
  }

  if (hasBorderBeenTouched()) {
    alert(
      `Tu as touché la bordure !\nTon score : ${score}\nMeilleur score : ${getBestScore()}`
    );
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
  ctx.beginPath();
  ctx.arc(
    apple.x + snakeSize / 2,
    apple.y + snakeSize / 2,
    snakeSize / 2.5,
    0,
    2 * Math.PI
  );
  ctx.fill();
  //ctx.fillRect(apple.x, apple.y, snakeSize, snakeSize);

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
  displayScore();
};

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "z":
      document.getElementById("up")?.click();
      break;
    case "ArrowDown":
    case "s":
      document.getElementById("down")?.click();
      break;
    case "ArrowLeft":
    case "q":
      document.getElementById("left")?.click();
      break;
    case "ArrowRight":
    case "d":
      document.getElementById("right")?.click();
      break;
    default:
      console.log("Touche non gérée :", event.key);
      break;
  }
});

document.getElementById("up")?.addEventListener("click", () => {
  snake.direction.x = 0;
  snake.direction.y = -1;
});
document.getElementById("down")?.addEventListener("click", () => {
  snake.direction.x = 0;
  snake.direction.y = 1;
});
document.getElementById("left")?.addEventListener("click", () => {
  snake.direction.x = -1;
  snake.direction.y = 0;
});
document.getElementById("right")?.addEventListener("click", () => {
  snake.direction.x = 1;
  snake.direction.y = 0;
});

resize();
window.addEventListener("resize", resize);

setup();
