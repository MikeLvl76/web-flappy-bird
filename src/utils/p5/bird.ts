import type p5 from "p5";
import type Pipe from "./pipe";

export default class Bird {
  p: p5;
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number = 8;
  isFalling: boolean;
  jumpingTime: number;
  rotationAngle: number;
  img: p5.Image | null;

  constructor(
    p: p5,
    x: number,
    y: number,
    width: number,
    height: number,
    img: p5.Image | null
  ) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isFalling = true;
    this.jumpingTime = 0;
    this.rotationAngle = 0;
    this.img = img;
  }

  fly() {
    if (this.isFalling) {
      this.y += this.dy * 1.3;
    } else {
      this.y -= this.dy * 1.15;
    }
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

  reset() {
    this.isFalling = true;
    this.jumpingTime = 0;
  }

  isOutOfBounds() {
    return this.y - this.y / 2 < 0 || this.y + this.height / 2 > this.p.height;
  }

  hasTouched(pipe: Pipe) {
    if (pipe.position === "up") {
      if (this.y <= pipe.y + pipe.height / 2 + 25) {
        if (
          this.x >= pipe.x - pipe.width / 2 &&
          this.x <= pipe.x + pipe.width / 2
        ) {
          return true;
        }
      }
    } else {
      if (this.y >= pipe.y + pipe.height / 2 - 25) {
        if (
          this.x >= pipe.x - pipe.width / 2 &&
          this.x <= pipe.x + pipe.width / 2
        ) {
          return true;
        }
      }
    }
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
}
