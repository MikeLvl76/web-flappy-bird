import type p5 from "p5";
import Bird from "./bird";
import imgUrl from "../../assets/bird.png";

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

  let bird: Bird | null = null;
  let img: p5.Image | null = null;

  p.preload = () => {
    img = p.loadImage(imgUrl, undefined, (ev) => console.error(ev));
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.8);
    p.frameRate(60);
    colorBackground(p);
    bird = new Bird(p.width / 4, p.height / 2, 90, 60);
  };

  p.draw = () => {
    colorBackground(p);
    if (bird && img) {
      bird.fly();
      bird.handleJumping(p);
      bird.draw(img, p);
    }
  };

  p.keyPressed = (e: { keyCode: number }) => {
    if (!bird) return false;

    if (e.keyCode === 32 && bird.isFalling) {
      bird.startJumping(p);
    }

    return false;
  };
};
