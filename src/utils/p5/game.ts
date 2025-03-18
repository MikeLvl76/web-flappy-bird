import type p5 from "p5";
import Bird from "./bird";
import DualPipe from "./dual-pipe";
import { SoundPlayer, type SoundFile } from "./sound-player";

type GameScore = {
  best: number;
  last: number;
};

type GameState = {
  hasStarted: boolean;
  score: GameScore;
};

export default class Game {
  p: p5;
  dualPipes: DualPipe[];
  state: GameState;
  bird?: Bird;
  soundPlayer?: SoundPlayer;

  constructor(p: p5, ...soundFiles: SoundFile[]) {
    this.p = p;
    this.dualPipes = [];
    this.state = {
      hasStarted: false,
      score: { best: 0, last: 0 },
    };
    if (soundFiles.length > 0) {
      this.soundPlayer = new SoundPlayer(...soundFiles);
    }
  }

  generateBird(birdImg: p5.Image) {
    this.bird = new Bird(this.p, birdImg)
      .setX(this.p.width / 4)
      .setY(this.p.height / 2)
      .setDimensions(90, 60);
  }

  generateDualPipes() {
    if (this.dualPipes.length > 0) {
      this.dualPipes.splice(0, this.dualPipes.length);
    }
    this.dualPipes.push(
      ...Array.from({ length: 5 }, (_, k) =>
        this.createDualPipe((k * this.p.width) / 4)
      ).flat()
    );
  }

  reset() {
    if (this.bird) {
      const { img } = this.bird;
      this.generateBird(img);
    }
    this.generateDualPipes();
    Object.assign(this.state, {
      score: { best: 0, last: 0 } as GameScore,
      hasStarted: false,
    });
  }

  increaseScore(by: number = 1) {
    this.state.score.last += by;
  }

  storeScore() {
    const item = localStorage.getItem("score");
    if (!item) {
      localStorage.setItem("score", JSON.stringify(this.state.score));
    } else {
      const parsedScore = JSON.parse(item) as GameScore;
      Object.assign(parsedScore, {
        last: this.state.score.last,
        best:
          this.state.score.last > parsedScore.best
            ? this.state.score.last
            : parsedScore.best,
      } as GameScore);
      localStorage.setItem("score", JSON.stringify(parsedScore));
    }
  }

  getFromStore() {
    const item = localStorage.getItem("score");
    if (!item) {
      return null;
    }
    return JSON.parse(item) as GameScore;
  }

  drawScore() {
    const text = `Score: ${this.state.score.last}`;
    this.p.rectMode(this.p.CENTER);
    this.p.noStroke();
    this.p.fill(255, 255, 255, 80);
    this.p.rect(100, 40, 1.1 * this.p.textWidth(text), 50);

    this.p.textAlign(this.p.CENTER);
    this.p.textSize(32);
    this.p.fill(0);
    this.p.text(text, 100, 50);
  }

  playSound(name: string) {
    if (this.soundPlayer) {
      this.soundPlayer.play(name);
    }
  }

  private createDualPipe(gap: number) {
    const top = {
      x: this.p.width / 2 + gap,
      y: 0,
      width: 120,
      height:
        this.p.height / 1.75 -
        Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1),
    };

    const bottom = {
      x: top.x,
      y: this.p.height,
      width: top.width,
      height:
        -this.p.height / 2 -
        Math.ceil(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1),
    };

    return new DualPipe(this.p).setTop(top).setBottom(bottom);
  }
}
