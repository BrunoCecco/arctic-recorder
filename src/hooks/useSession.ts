import { useState, useCallback, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { LocationService } from '../services/LocationService';
import { AudioService } from '../services/AudioService';
import { VoiceDetectionService } from '../services/VoiceDetectionService';
import { RecordingSession } from '../types';

export const useSession = () => {
  const [session, setSession] = useState<RecordingSession>(null);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [starting, setStarting] = useState(false);

  const storageService = new StorageService();
  const locationService = new LocationService();
  const audioService = new AudioService();
  const voiceDetectionService = new VoiceDetectionService();

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startSession = useCallback(async () => {
    try {
      setStarting(true);
      const hasPermission = await locationService.requestPermissions();
      if (!hasPermission) {
        console.error('Location permissions not granted');
        alert(
          'No location service permissions - go to settings to change this'
        );
        setStarting(false);
        return false;
      }

      const isLocationEnabled = await locationService.isEnabled();
      if (!isLocationEnabled) {
        console.error('Location services are not enabled');
        setStarting(false);
        return false;
      }

      const initialLocation = await locationService.getCurrentLocation();
      if (!initialLocation) {
        console.error('Could not get initial location');
        setStarting(false);
        return false;
      }

      const newSession: RecordingSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        gpsPoints: [initialLocation],
        voiceNotes: [],
        isActive: true,
      };

      setSession(newSession);
      setIsActive(true);
      setDuration(0);

      locationService.startTracking((location) => {
        setSession((prev) => ({
          ...prev,
          gpsPoints: [...prev.gpsPoints, location],
        }));
      });

      setStarting(false);
      return true;
    } catch (error) {
      console.error('Error starting session:', error);
      setStarting(false);
      return false;
    }
  }, []);

  const stopSession = useCallback(async () => {
    try {
      setIsActive(false);
      locationService.stopTracking();
      voiceDetectionService.stopMonitoring();

      const updatedSession = {
        ...session,
        endTime: Date.now(),
        isActive: false,
      };

      await storageService.saveSession(updatedSession);
      setSession(updatedSession);
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  }, [session]);

  const resetSession = useCallback(async () => {
    if (isActive) {
      await stopSession();
    }
    setSession(null);
    setDuration(0);
  }, [isActive, stopSession]);

  const exportSession = useCallback(async () => {
    if (!session) return null;
    return await storageService.exportGpx(session);
  }, [session]);

  return {
    session,
    isActive,
    starting,
    duration,
    startSession,
    stopSession,
    resetSession,
    exportSession,
  };
};
