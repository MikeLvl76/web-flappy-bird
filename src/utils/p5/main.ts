import type p5 from "p5";

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

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.8);
    colorBackground(p);
  };

  p.draw = () => {};
};
