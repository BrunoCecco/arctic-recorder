import { TNSPlayer, TNSRecorder } from 'nativescript-audio';

export class AudioService {
  private recorder: TNSRecorder;
  private player: TNSPlayer;
  private isRecording: boolean = false;
  private clickSound: TNSPlayer;

  constructor() {
    this.recorder = new TNSRecorder();
    this.player = new TNSPlayer();
    this.clickSound = new TNSPlayer();
    this.initClickSound();
  }

  private async initClickSound() {
    // Initialize click sound for feedback
    await this.clickSound.initFromFile({
      audioFile: '~/assets/click.mp3',
      loop: false,
    });
  }

  async startRecording(filePath: string): Promise<void> {
    if (this.isRecording) return;

    await this.recorder.start({
      filename: filePath,
      metering: true,
      format: 'm4a',
    });
    this.isRecording = true;
  }

  async stopRecording(): Promise<void> {
    if (!this.isRecording) return;

    await this.recorder.stop();
    this.isRecording = false;
  }

  async playFeedbackClick(): Promise<void> {
    await this.clickSound.play();
  }

  async playNote(filePath: string): Promise<void> {
    await this.player.initFromFile({
      audioFile: filePath,
      loop: false,
    });
    await this.player.play();
  }

  async pausePlayback(): Promise<void> {
    await this.player.pause();
  }

  async stopPlayback(): Promise<void> {
    await this.player.dispose();
  }

  async detectVoiceActivity(): Promise<boolean> {
    // Implement voice activity detection
    // This would need to be implemented with a more sophisticated
    // audio analysis library or native module
    return false;
  }
}
