import { Folder, knownFolders, File, path } from '@nativescript/core';
import { RecordingSession } from '../../types';

export class StorageService {
  private dataFolder: Folder;
  private audioFolder: Folder;

  constructor() {
    this.dataFolder = knownFolders.documents().getFolder('data');
    this.audioFolder = knownFolders.documents().getFolder('audio');
    this.ensureFoldersExist();
  }

  private ensureFoldersExist(): void {
    if (!this.dataFolder.isKnown) {
    }
    if (!this.audioFolder.isKnown) {
    }
  }

  async saveSession(session: RecordingSession): Promise<void> {
    try {
      const filePath = path.join(
        this.dataFolder.path,
        `session_${session.id}.json`
      );
      const file = File.fromPath(filePath);
      await file.writeText(JSON.stringify(session, null, 2));
    } catch (error) {
      console.error('Error saving session:', error);
      throw new Error('Failed to save session');
    }
  }

  async loadSession(sessionId: string): Promise<RecordingSession | null> {
    try {
      const filePath = path.join(
        this.dataFolder.path,
        `session_${sessionId}.json`
      );
      const file = File.fromPath(filePath);
      const content = await file.readText();
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }

  async loadSessions(): Promise<RecordingSession[]> {
    try {
      const sessions: RecordingSession[] = [];
      const files = this.dataFolder.getEntitiesSync();

      for (const file of files) {
        if (file instanceof File && file.name.startsWith('session_')) {
          const content = await file.readText();
          sessions.push(JSON.parse(content));
        }
      }

      return sessions.sort((a, b) => b.startTime - a.startTime);
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const filePath = path.join(
        this.dataFolder.path,
        `session_${sessionId}.json`
      );
      const file = File.fromPath(filePath);
      await file.remove();
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  getAudioFilePath(noteId: string): string {
    return path.join(this.audioFolder.path, `note_${noteId}.m4a`);
  }

  async deleteAudioFile(noteId: string): Promise<boolean> {
    try {
      const filePath = this.getAudioFilePath(noteId);
      const file = File.fromPath(filePath);
      await file.remove();
      return true;
    } catch (error) {
      console.error('Error deleting audio file:', error);
      return false;
    }
  }
}
