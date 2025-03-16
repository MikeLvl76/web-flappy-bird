import type p5 from "p5";
import Bird from "./bird";
import birdImgUrl from "../../assets/bird.png";
import DualPipe from "./dual-pipe";

export const sketch = (p: p5) => {
  const colorBackground = (p: p5) => {
    const c1 = p.color(63, 191, 222);
    const c2 = p.color(244);

    for (let y = 0; y < p.height; y++) {
      const n = p.map(y, 0, p.height, 0, 0.5);
      const newc = p.lerpColor(c1, c2, n);
      p.stroke(newc);
      p.line(0, y, p.width, y);
    }
  };

  const createDualPipe = (p: p5, index: number): DualPipe => {
    const top = {
      x: p.width / 2 + index * 300,
      y: 0,
      width: 120,
      height:
        p.height / 1.75 -
        Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1),
    };

    const bottom = {
      x: top.x,
      y: p.height,
      width: top.width,
      height:
        -p.height / 2 -
        Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1),
    };

    return new DualPipe(p).setTop(top).setBottom(bottom);
  };

  const generateDualPipes = (p: p5): DualPipe[] =>
    Array.from({ length: 5 }, (_, k) => createDualPipe(p, k)).flat();

  const bird = new Bird(p);
  const pipes: DualPipe[] = [];
  let birdImg: p5.Image | null = null;
  let score: number;
  let hasScored: boolean;

  p.preload = () => {
    birdImg = p.loadImage(birdImgUrl, undefined, (ev) => console.error(ev));
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.9);
    p.frameRate(60);
    colorBackground(p);
    bird
      .setX(p.width / 4)
      .setY(p.height / 2)
      .setDimensions(90, 60)
      .setImg(birdImg);
    pipes.push(...generateDualPipes(p));
    score = 0;
    hasScored = false;
  };

  p.draw = () => {
    colorBackground(p);
    if (!birdImg) {
      p.noLoop();
      return;
    }

    bird.fly();
    bird.handleJumping();
    bird.draw();

    if (bird.isOutOfBounds()) {
      p.noLoop();
    }

    pipes.forEach((pipe) => {
      pipe.draw();
      pipe.scroll();

      if (bird.hasTouched(pipe)) {
        p.noLoop();
      }
      if (bird.hasPassed(pipe)) {
        score++;
      }
      if (pipe.top.x + pipe.top.width < 0) {
        pipe.isPassed = false;
      }
    });

    p.textSize(32);
    p.fill(255, 0, 0);
    p.text(`Score: ${score}`, 50, 50);
  };

  p.keyPressed = (e: { keyCode: number }) => {
    if (!bird) return false;

    if (e.keyCode === 32 && bird.isFalling) {
      bird.startJumping();
    }

    return false;
  };
};
