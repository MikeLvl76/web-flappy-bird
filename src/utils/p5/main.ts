import type p5 from "p5";
import Bird from "./bird";
import birdImgUrl from "../../assets/bird.png";
import Pipe from "./pipe";

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

  const createPipePair = (p: p5, index: number): Pipe[] => {
    const xPosition = p.width / 2 + index * 300;

    const topHeight = p.height / 1.75 - Math.floor(Math.random() * 50) * index;
    const bottomHeight =
      -p.height / 1.75 - Math.floor(Math.random() * 30) * index;

    return [
      new Pipe(xPosition, 0, 120, topHeight, "up"),
      new Pipe(xPosition, p.height, 120, bottomHeight, "down"),
    ];
  };

  const generatePipes = (p: p5): Pipe[] =>
    Array.from({ length: 5 }, (_, k) => createPipePair(p, k)).flat();

  let bird: Bird | null = null;
  let birdImg: p5.Image | null = null;

  const pipes: Pipe[] = [];

  p.preload = () => {
    birdImg = p.loadImage(birdImgUrl, undefined, (ev) => console.error(ev));
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.8);
    p.frameRate(60);
    colorBackground(p);
    bird = new Bird(p.width / 4, p.height / 2, 90, 60);
    pipes.push(...generatePipes(p));
  };

  p.draw = () => {
    colorBackground(p);
    if (!bird || !birdImg) {
      p.noLoop();
      return;
    }

    bird.fly();
    bird.handleJumping(p);
    bird.draw(birdImg, p);

    pipes.forEach((pipe, index) => {
      pipe.draw(p);
      pipe.horizontalScroll(p, index);
    });
  };

  p.keyPressed = (e: { keyCode: number }) => {
    if (!bird) return false;

    if (e.keyCode === 32 && bird.isFalling) {
      bird.startJumping(p);
    }

    return false;
  };
};
