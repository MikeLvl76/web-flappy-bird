// Original version from https://github.com/processing/p5.js/issues/4479#issuecomment-2357248803 because p5.sound doesn't work with Vite and Vue

export type SoundFile = {
  name: string;
  path: string;
  volume: number;
};

export class SoundPlayer {
  private audioContext: AudioContext;
  private soundBuffers: Map<string, AudioBuffer>;
  private gainNodes: Map<string, GainNode>;

  constructor(...files: SoundFile[]) {
    this.audioContext = new window.AudioContext();
    this.soundBuffers = new Map();
    this.gainNodes = new Map();

    files.forEach(async (file) => {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = file.volume;
      gainNode.connect(this.audioContext.destination);
      this.gainNodes.set(file.name, gainNode);

      // Load and store sound buffer
      const buffer = await this.loadSound(file.path);
      if (buffer) {
        this.soundBuffers.set(file.name, buffer);
      }
    });
  }

  private async loadSound(soundFile: string): Promise<AudioBuffer | null> {
    try {
      const response = await fetch(soundFile);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(`Error loading sound: ${soundFile}`, error);
      return null;
    }
  }

  play(name: string) {
    const buffer = this.soundBuffers.get(name);
    const gainNode = this.gainNodes.get(name);

    if (buffer && gainNode) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      source.start(0);
    } else {
      console.warn(`Sound "${name}" not found or not loaded yet.`);
    }
  }

  setVolume(name: string, volume: number) {
    const gainNode = this.gainNodes.get(name);
    if (gainNode) {
      gainNode.gain.value = Math.min(1, Math.max(0, volume)); // Clamp between 0 and 1
    } else {
      console.warn(`Volume adjustment failed: Sound "${name}" not found.`);
    }
  }
}
