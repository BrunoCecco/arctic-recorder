import * as React from 'react';
import { useExport } from '../hooks/useExport';
import { RecordingSession } from '../types';
import { Dialogs } from '@nativescript/core';

interface ExportButtonProps {
  session: RecordingSession;
  onExportComplete?: (filePath: string) => void;
}

export function ExportButton({ session, onExportComplete }: ExportButtonProps) {
  const { isExporting, exportError, exportToGpx } = useExport();

  const handleExport = async () => {
    if (!session || isExporting) return;

    const filePath = await exportToGpx(session);
    
    if (filePath) {
      await Dialogs.alert({
        title: 'Export Successful',
        message: `GPX file saved to:\n${filePath}`,
        okButtonText: 'OK'
      });
      onExportComplete?.(filePath);
    } else if (exportError) {
      await Dialogs.alert({
        title: 'Export Failed',
        message: exportError,
        okButtonText: 'OK'
      });
    }
  };

  return (
    <button
      className={`p-2 rounded ${isExporting ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
      onTap={handleExport}
      isEnabled={!isExporting && !!session}
    >
      {isExporting ? 'Exporting...' : 'Export GPX'}
    </button>
  );
}