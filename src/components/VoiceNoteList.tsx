import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { formatDuration, formatCoordinates } from '../utils/formatters';
import { AudioService } from '../services/AudioService';
import { VoiceNote } from '../types';

interface VoiceNoteListProps {
  notes: VoiceNote[];
}

export function VoiceNoteList({ notes }: VoiceNoteListProps) {
  const [playingNoteId, setPlayingNoteId] = React.useState<string | null>(null);
  const audioService = new AudioService();

  const handlePlayNote = async (note: VoiceNote) => {
    if (playingNoteId === note.id) {
      await audioService.pausePlayback();
      setPlayingNoteId(null);
    } else {
      if (playingNoteId) {
        await audioService.stopPlayback();
      }
      await audioService.playNote(note.audioPath);
      setPlayingNoteId(note.id);
    }
  };

  return (
    <scrollView height="300">
      <stackLayout>
        {notes.map((note) => (
          <gridLayout
            key={note.id}
            columns="*, auto"
            className="p-2 border-b border-gray-200"
          >
            <stackLayout>
              <label className="font-bold">
                {new Date(note.startTime).toLocaleTimeString()}
              </label>
              <label className="text-sm text-gray-600">
                {formatCoordinates(
                  note.location.latitude,
                  note.location.longitude
                )}
              </label>
              <label className="text-sm">
                Duration: {formatDuration(note.duration)}
              </label>
            </stackLayout>
            <button
              className={`p-2 rounded ${
                playingNoteId === note.id ? 'bg-red-500' : 'bg-blue-500'
              }`}
              onTap={() => handlePlayNote(note)}
            >
              {playingNoteId === note.id ? '⏸️' : '▶️'}
            </button>
          </gridLayout>
        ))}
      </stackLayout>
    </scrollView>
  );
}
