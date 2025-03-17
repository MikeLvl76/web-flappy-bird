// Copied from https://github.com/processing/p5.js/issues/4479#issuecomment-2357248803 because p5.sound doesn't work with Vite

export class SoundPlayer {
  audioContext: AudioContext;
  soundBuffer: AudioBuffer | null;
  gainNode: GainNode;

  constructor(soundFile: string, volume = 0) {
    this.audioContext = new window.AudioContext();
    this.soundBuffer = null;

    // Create a GainNode and set the default volume to 50% (0.5)
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = volume; // 50% volume

    // Connect the GainNode to the audio context destination
    this.gainNode.connect(this.audioContext.destination);

    this.loadSound(soundFile);
  }

  // Load and decode the sound file
  async loadSound(soundFile: string) {
    const response = await fetch(soundFile);
    const arrayBuffer = await response.arrayBuffer();
    this.soundBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  // Create and play a new AudioBufferSourceNode
  play() {
    if (this.soundBuffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.soundBuffer;
      source.connect(this.gainNode); // Connect to the GainNode instead of destination
      source.start(0); // Play the sound immediately
    }
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume; // volume should be between 0.0 (mute) and 1.0 (full)
  }
}
