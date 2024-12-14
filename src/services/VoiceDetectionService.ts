import { TNSRecorder } from 'nativescript-audio';

export class VoiceDetectionService {
  private static readonly AMPLITUDE_THRESHOLD = 0.2;
  private static readonly DETECTION_INTERVAL = 100; // ms
  private recorder: TNSRecorder;
  private isMonitoring: boolean = false;
  private onVoiceDetected: () => void;

  constructor() {
    this.recorder = new TNSRecorder();
  }

  async startMonitoring(callback: () => void): Promise<void> {
    this.onVoiceDetected = callback;
    this.isMonitoring = true;

    await this.recorder.start({
      filename: 'temp.m4a',
      metering: true,
      format: 'm4a',
    });

    this.monitor();
  }

  private monitor(): void {
    if (!this.isMonitoring) return;

    const meterLevel = this.recorder.getMeters();
    if (meterLevel > VoiceDetectionService.AMPLITUDE_THRESHOLD) {
      this.onVoiceDetected();
    }

    setTimeout(() => this.monitor(), VoiceDetectionService.DETECTION_INTERVAL);
  }

  async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;
    await this.recorder.stop();
  }
}
