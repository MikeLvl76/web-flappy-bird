import type p5 from "p5";

type PipePosition = "up" | "down";

export default class Pipe {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  position: PipePosition;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    position: PipePosition
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = 20;
    this.position = position;
  }

  horizontalScroll(p: p5, index: number) {
    this.x -= this.dx * 0.2;

    if (this.x + this.width / 2 <= 0) {
      this.x = p.width + this.width / 2;
      this.height =
        this.position === "up"
          ? p.height / 1.75 - Math.floor(Math.random() * 30) * index
          : -p.height / 1.75 - Math.floor(Math.random() * 40) * index;
    }
  }

  draw(p: p5) {
    p.noStroke();
    p.fill(0, 200, 0);
    p.rectMode(p.CENTER);
    p.rect(this.x, this.y, this.width, this.height);

    p.stroke(0);
    p.fill(0, 166, 0);
    if (this.position === "up") {
      p.rect(this.x, this.height - this.height / 2, this.width * 1.2, 50);
    } else {
      p.rect(this.x, this.y + this.height / 2, this.width * 1.2, 50);
    }
  }
}
