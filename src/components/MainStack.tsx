import * as React from 'react';
import { BaseNavigationContainer } from '@react-navigation/core';
import {
  stackNavigatorFactory,
  tabViewNavigatorFactory,
} from 'react-nativescript-navigation';
import { ControlPanel } from './ControlPanel';
import { VoiceNoteList } from './VoiceNoteList';
import { RecordingScreen } from './RecordingScreen';
import { SessionDetails } from './SessionDetails';
import { useSession } from '../hooks/useSession';

const TabNavigator = tabViewNavigatorFactory();
const StackNavigator = stackNavigatorFactory();

/* Tabs Navigator. */
export const MainStack = () => {
  const {
    session,
    starting,
    isActive,
    duration,
    startSession,
    stopSession,
    resetSession,
    exportSession,
  } = useSession();
  return (
    <BaseNavigationContainer>
      <TabNavigator.Navigator initialRouteName="Control">
        <TabNavigator.Screen
          name="Control"
          options={{
            title: 'Control Panel',
          }}
        >
          {(props) => (
            <ControlPanel
              {...props}
              starting={starting}
              isActive={isActive}
              duration={duration}
              onStart={startSession}
              onStop={stopSession}
              onReset={resetSession}
              onExport={exportSession}
            />
          )}
        </TabNavigator.Screen>

        <TabNavigator.Screen
          name="Record"
          component={RecordingScreen}
          options={{
            title: 'Recording',
          }}
        />

        <TabNavigator.Screen
          name="Notes"
          options={{
            title: 'Voice Notes',
          }}
        >
          {() => <VoiceNoteList notes={session?.voiceNotes || []} />}
        </TabNavigator.Screen>
      </TabNavigator.Navigator>
    </BaseNavigationContainer>
  );
};
