import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-nativescript';
// import { LocationService } from '../services/LocationService';
import { AudioService } from '../services/AudioService';
import { StorageService } from '../services/StorageService';
import { RecordingSession } from '../types';
import { formatDuration } from '../utils/formatters';

export function RecordingScreen() {
  const [session, setSession] = useState<RecordingSession>(null);
  const [duration, setDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // const locationService = new LocationService();
  const audioService = new AudioService();
  const storageService = new StorageService();

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        audioService.playFeedbackClick();
      }, 5000); // Click every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // const startRecording = async () => {
  //   const hasPermission = await locationService.requestPermissions();
  //   if (!hasPermission) return;

  //   const newSession: RecordingSession = {
  //     id: Date.now().toString(),
  //     startTime: Date.now(),
  //     gpsPoints: [],
  //     voiceNotes: [],
  //     isActive: true,
  //   };

  //   setSession(newSession);
  //   setIsActive(true);

  //   locationService.startTracking((location) => {
  //     setSession((prev) => ({
  //       ...prev,
  //       gpsPoints: [...prev.gpsPoints, location],
  //     }));
  //   });
  // };

  const stopRecording = async () => {
    setIsActive(false);
    // locationService.stopTracking();

    const updatedSession = {
      ...session,
      endTime: Date.now(),
      isActive: false,
    };

    await storageService.saveSession(updatedSession);
    setSession(updatedSession);
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">
        {formatDuration(duration)}
      </label>
      {/* 
      <button
        className={`p-4 rounded-full ${
          isActive ? 'bg-red-500' : 'bg-green-500'
        }`}
        onTap={isActive ? stopRecording : startRecording}
      >
        {isActive ? 'Stop Recording' : 'Start Recording'}
      </button> */}

      {session?.voiceNotes.length > 0 && (
        <scrollView>
          {session.voiceNotes.map((note) => (
            <label key={note.id}>
              {new Date(note.startTime).toLocaleTimeString()} - {note.duration}s
            </label>
          ))}
        </scrollView>
      )}
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
