import { Folder, knownFolders, File, path } from '@nativescript/core';
import { RecordingSession } from '../types';

export class StorageService {
  private dataFolder: Folder;
  private audioFolder: Folder;

  constructor() {
    this.dataFolder = knownFolders.ios.downloads();
    this.audioFolder = knownFolders.ios.downloads();
  }

  async saveSession(session: RecordingSession): Promise<void> {
    const filePath = path.join(
      this.dataFolder.path,
      `session_${session.id}.json`
    );
    const file = File.fromPath(filePath);
    await file.writeText(JSON.stringify(session));
    alert('File saved: ' + file.name + ': ' + file.path);
  }

  async loadSessions(): Promise<RecordingSession[]> {
    const sessions: RecordingSession[] = [];
    const files = this.dataFolder.getEntitiesSync();

    for (const file of files) {
      if (file instanceof File && file.name.startsWith('session_')) {
        const content = await file.readText();
        sessions.push(JSON.parse(content));
      }
    }

    return sessions;
  }

  getAudioFilePath(noteId: string): string {
    return path.join(this.audioFolder.path, `note_${noteId}.m4a`);
  }

  async exportGpx(session: RecordingSession): Promise<string> {
    const gpxContent = this.generateGpx(session);
    const filePath = path.join(
      this.dataFolder.path,
      `session_${session.id}.gpx`
    );
    const file = File.fromPath(filePath);
    await file.writeText(gpxContent);
    return filePath;
  }

  private generateGpx(session: RecordingSession): string {
    // Generate GPX format compatible with sports apps
    // Implementation details here
    return ''; // Placeholder
  }
}
