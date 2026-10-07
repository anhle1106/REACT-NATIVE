import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LabSelector } from './src/components/LabSelector';
import { LABS } from './src/labs';

export default function App() {
  const [currentLabId, setCurrentLabId] = useState<string>('lab_weather');

  const activeLab = LABS.find((l) => l.id === currentLabId) || LABS[0];
  const CurrentLabComponent = activeLab.component;

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <LabSelector
          currentLabId={currentLabId}
          onSelectLab={setCurrentLabId}
        />
        <CurrentLabComponent />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
