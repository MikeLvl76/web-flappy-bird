import type p5 from "p5";

type PipePosition = "up" | "down";

export default class Pipe {
  p: p5;
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  position: PipePosition;

  constructor(
    p: p5,
    x: number,
    y: number,
    width: number,
    height: number,
    position: PipePosition
  ) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = 20;
    this.position = position;
  }

  horizontalScroll(index: number) {
    this.x -= this.dx * 0.2;

    if (this.x + this.width / 2 <= 0) {
      this.x = this.p.width + this.width / 2;
      this.height =
        this.position === "up"
          ? this.p.height / 1.75 - Math.floor(Math.random() * 30) * index
          : -this.p.height / 1.75 - Math.floor(Math.random() * 40) * index;
    }
  }

  draw() {
    this.p.noStroke();
    this.p.fill(0, 200, 0);
    this.p.rectMode(this.p.CENTER);
    this.p.rect(this.x, this.y, this.width, this.height);

    this.p.stroke(0);
    this.p.fill(0, 166, 0);
    if (this.position === "up") {
      this.p.rect(this.x, this.height - this.height / 2, this.width * 1.2, 50);
    } else {
      this.p.rect(this.x, this.y + this.height / 2, this.width * 1.2, 50);
    }
  }
}
