import p5 from "p5";
import birdImgUrl from "../../assets/bird.png";
import birdFlapSound from "../../assets/flap.mp3";
import scoringSound from "../../assets/point.mp3";
import hitSound from "../../assets/hit.mp3";
import { type SoundFile } from "./sound-player";
import Game from "./game";

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

  const game = new Game(
    p,
    { name: "flap", path: birdFlapSound, volume: 1 } as SoundFile,
    { name: "score", path: scoringSound, volume: 1 } as SoundFile,
    { name: "hit", path: hitSound, volume: 1 } as SoundFile
  );

  const menuScreen = () => {
    if (!p.isLooping()) {
      p.loop();
    }
    p.background(0);
    p.textAlign(p.CENTER);
    p.fill(255);
    p.textSize(64);
    p.text("Play", p.width / 2, p.height / 2);

    const score = game.getFromStore();
    if (score) {
      p.textSize(48);
      p.text(`Last score: ${score.last}`, p.width / 2, p.height / 2 + 150);
      p.textSize(32);
      p.text(`Best score: ${score.best}`, p.width / 2, p.height / 2 + 200);
    }

    if (
      p.mouseX < p.width / 2 + p.textWidth("Play") / 2 &&
      p.mouseX > p.width / 2 - p.textWidth("Play") / 2 &&
      p.mouseY < p.height / 2 &&
      p.mouseY > p.height / 2 - 64
    ) {
      p.cursor(p.HAND);
      if (p.mouseIsPressed) {
        game.state.hasStarted = true;
      }
    } else {
      p.cursor(p.ARROW);
    }
  };

  let birdImg: p5.Image | null;

  p.preload = () => {
    birdImg = p.loadImage(birdImgUrl);
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.9);
    p.frameRate(60);
    if (!birdImg) {
      p.noLoop();
      alert("An error has occured");
      throw new Error("Image has not loaded");
    }
    game.generateBird(birdImg);
    game.generateDualPipes();
  };

  p.draw = () => {
    if (game.state.hasStarted && game.bird && birdImg) {
      colorBackground(p);
      p.smooth();

      game.bird.fly();
      game.bird.handleJumping();
      game.bird.draw();

      if (game.bird.isOutOfBounds()) {
        game.playSound("hit");
        game.storeScore();
        game.reset();
        menuScreen();
      }

      game.dualPipes.forEach((pipe) => {
        pipe.draw();
        pipe.scroll();

        if (game.bird?.hasTouched(pipe)) {
          game.playSound("hit");
          game.storeScore();
          game.reset();
          menuScreen();
        }

        if (game.bird?.hasPassed(pipe)) {
          game.playSound("score");
          game.increaseScore();
        }
      });

      game.drawScore();
    } else {
      menuScreen();
    }
  };

  p.keyPressed = (e: { keyCode: number }) => {
    if (!game.bird) return false;

    if (e.keyCode === 32 && game.bird.isFalling && game.state.hasStarted) {
      game.bird.startJumping();
      game.playSound("flap");
    }

    return false;
  };
};
