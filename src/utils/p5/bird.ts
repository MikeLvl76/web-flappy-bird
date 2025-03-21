import type p5 from "p5";
import type DualPipe from "./dual-pipe";

export default class Bird {
  p: p5;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: number;
  isFalling: boolean;
  jumpingTime: number;
  rotationAngle: number;
  img: p5.Image;

  constructor(p: p5, img: p5.Image) {
    this.p = p;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.offset = 8;
    this.isFalling = true;
    this.jumpingTime = 0;
    this.rotationAngle = 0;
    this.img = img;
  }

  setX(x: number) {
    this.x = x;
    return this;
  }

  setY(y: number) {
    this.y = y;
    return this;
  }

  setDimensions(w: number, h: number) {
    this.width = w;
    this.height = h;
    return this;
  }

  setImg(img: p5.Image) {
    this.img = img;
    return this;
  }

  fly() {
    this.setY(
      this.isFalling ? this.y + this.offset * 1.3 : this.y - this.offset * 1.15
    );
  }

  startJumping() {
    this.isFalling = false;
    this.jumpingTime = this.p.millis();
  }

  handleJumping() {
    if (!this.isFalling && !this.p.keyIsDown(32)) {
      const elapsedTime = this.p.millis() - this.jumpingTime;

      if (elapsedTime >= 250) {
        this.reset();
      }
    }
  }

  isOutOfBounds() {
    return this.y - this.y / 2 < 0 || this.y + this.height / 2 > this.p.height;
  }

  hasTouched(pipe: DualPipe) {
    const { top, bottom } = pipe;

    const hasTouchedTop =
      this.y <= top.y + top.height / 2 + 45 &&
      this.x >= top.x - top.width / 2 &&
      this.x <= top.x + top.width / 2;

    const hasTouchedBottom =
      this.y >= bottom.y + bottom.height / 2 - 45 &&
      this.x >= bottom.x - bottom.width / 2 &&
      this.x <= bottom.x + bottom.width / 2;

    return hasTouchedTop || hasTouchedBottom;
  }

  hasPassed(pipe: DualPipe) {
    const { top } = pipe;

    const passedX = this.x > top.x + top.width / 2 + 25;

    if (passedX && !pipe.isPassed) {
      pipe.isPassed = true;
      return true;
    }

    return false;
  }

  draw() {
    if (!this.img) {
      return;
    }

    this.p.push();
    this.p.imageMode(this.p.CENTER);
    this.p.angleMode(this.p.DEGREES);
    this.p.translate(this.x, this.y);

    const targetAngle = this.isFalling ? 45 : -45;

    this.rotationAngle = this.p.lerp(this.rotationAngle, targetAngle, 0.25);

    this.p.rotate(this.rotationAngle);
    this.p.image(this.img, 0, 0, this.width, this.height);
    this.p.pop();
  }

  private reset() {
    this.isFalling = true;
    this.jumpingTime = 0;
  }
}
