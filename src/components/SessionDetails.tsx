import * as React from 'react';
import { formatDuration } from '../utils/formatters';
import { ExportButton } from './ExportButton';
import { RecordingSession } from '../types';

interface SessionDetailsProps {
  session: RecordingSession;
}

export function SessionDetails({ session }: SessionDetailsProps) {
  if (!session) return null;

  const duration = session.endTime 
    ? Math.floor((session.endTime - session.startTime) / 1000)
    : 0;

  return (
    <stackLayout className="p-4 bg-white rounded-lg shadow-md">
      <label className="text-lg font-bold mb-2">
        Session Details
      </label>
      
      <gridLayout rows="auto, auto, auto" columns="auto, *" className="mb-4">
        <label row={0} col={0} className="font-medium">Start Time:</label>
        <label row={0} col={1} className="ml-2">
          {new Date(session.startTime).toLocaleString()}
        </label>

        <label row={1} col={0} className="font-medium">Duration:</label>
        <label row={1} col={1} className="ml-2">
          {formatDuration(duration)}
        </label>

        <label row={2} col={0} className="font-medium">Voice Notes:</label>
        <label row={2} col={1} className="ml-2">
          {session.voiceNotes.length}
        </label>
      </gridLayout>

      <ExportButton session={session} />
    </stackLayout>
  );
}