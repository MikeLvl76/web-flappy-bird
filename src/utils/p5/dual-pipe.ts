import type p5 from "p5";

type Pipe = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default class DualPipe {
  p: p5;
  top: Pipe;
  bottom: Pipe;
  horizontalScrollingSpeed: number;
  offset: number;
  isPassed: boolean;

  constructor(p: p5) {
    this.p = p;
    this.top = { x: 0, y: 0, width: 0, height: 0 };
    this.bottom = { x: 0, y: 0, width: 0, height: 0 };
    this.horizontalScrollingSpeed = 0.2;
    this.offset = 20;
    this.isPassed = false;
  }

  setTop(top: Pipe) {
    this.top = top;
    return this;
  }

  setBottom(bottom: Pipe) {
    this.bottom = bottom;
    return this;
  }

  scroll() {
    this.top.x -= this.offset * this.horizontalScrollingSpeed;
    this.bottom.x -= this.offset * this.horizontalScrollingSpeed;

    if (this.top.x + this.top.width / 2 <= 0) {
      this.adjust(
        this.p.width + this.p.width / 5,
        Math.abs(
          this.top.height +
            Math.ceil(Math.random() * 150) *
              (Math.round(Math.random()) ? 1 : -1)
        ),
        -Math.abs(
          -this.p.height +
            this.top.height * 0.9 +
            Math.ceil(Math.random() * 150) *
              (Math.round(Math.random()) ? 1 : -1)
        )
      );
      this.isPassed = false;
    }
  }

  adjust(x: number, topHeight: number, bottomHeight: number) {
    this.setTop({
      x,
      y: this.top.y,
      width: this.top.width,
      height: topHeight,
    });
    this.setBottom({
      x,
      y: this.bottom.y,
      width: this.bottom.width,
      height: bottomHeight,
    });
  }

  draw() {
    const { top, bottom } = this;
    this.p.stroke(2);
    this.p.fill(0, 200, 0);
    this.p.rectMode(this.p.CENTER);

    // Top pipe
    this.p.rect(top.x, top.y, top.width, top.height);
    this.p.rect(top.x, top.y + top.height / 2, top.width * 1.2, 50);

    // Bottom pipe
    this.p.rect(bottom.x, bottom.y, bottom.width, bottom.height);
    this.p.rect(bottom.x, bottom.y + bottom.height / 2, bottom.width * 1.2, 50);
  }
}
