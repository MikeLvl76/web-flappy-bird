import type p5 from "p5";

export default class Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number = 8;
  isFalling: boolean;
  jumpingTime: number;
  rotationAngle: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isFalling = true;
    this.jumpingTime = 0;
    this.rotationAngle = 0;
  }

  fly() {
    if (this.isFalling) {
      this.y += this.dy * 1.3;
    } else {
      this.y -= this.dy * 1.15;
    }
  }

  startJumping(p: p5) {
    this.isFalling = false;
    this.jumpingTime = p.millis();
  }

  handleJumping(p: p5) {
    if (!this.isFalling) {
      const elapsedTime = p.millis() - this.jumpingTime;

      if (elapsedTime >= 250) {
        this.reset();
      }
    }
  }

  reset() {
    this.isFalling = true;
    this.jumpingTime = 0;
  }

  draw(img: p5.Image, p: p5) {
    p.push();
    p.imageMode(p.CENTER);
    p.angleMode(p.DEGREES);
    p.translate(this.x, this.y);

    const targetAngle = this.isFalling ? 45 : -45;

    this.rotationAngle = p.lerp(this.rotationAngle, targetAngle, 0.25);

    p.rotate(this.rotationAngle);
    p.image(img, 0, 0, this.width, this.height);
    p.pop();
  }
}
