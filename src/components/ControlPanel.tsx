import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { Dialogs } from '@nativescript/core';
import { formatDuration } from '../utils/formatters';
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from 'react-nativescript-navigation';

interface ControlPanelProps {
  route: RouteProp<any, string>;
  navigation: FrameNavigationProp<any, any>;
  isActive: boolean;
  starting: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function ControlPanel({
  starting,
  isActive,
  duration,
  onStart,
  onStop,
  onReset,
  onExport,
}: ControlPanelProps) {
  const handleReset = async () => {
    const result = await Dialogs.confirm({
      title: 'Reset Session',
      message:
        'Are you sure you want to reset? All recorded data will be lost.',
      okButtonText: 'Reset',
      cancelButtonText: 'Cancel',
    });

    if (result) {
      onReset();
    }
  };

  return (
    <stackLayout style={styles.container}>
      <label className="text-3xl font-bold mb-4">
        {formatDuration(duration)}
      </label>

      <button
        className={`p-4 rounded-full mb-4 ${
          isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}
        onTap={isActive ? onStop : onStart}
      >
        {starting ? 'Starting...' : isActive ? 'Stop Session' : 'Start Session'}
      </button>

      <button
        className="m-2 p-2 rounded bg-blue-500 text-white"
        onTap={handleReset}
      >
        Reset
      </button>
      <button
        className="m-2 p-2 rounded bg-blue-500 text-white"
        onTap={onExport}
      >
        Export GPX
      </button>
    </stackLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
