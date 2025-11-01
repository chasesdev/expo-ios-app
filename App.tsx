import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  // Show a helpful message on non-iOS platforms
  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.platformWarning}>
        <Text style={styles.warningText}>⚠️ iOS Only App</Text>
        <Text style={styles.warningDescription}>
          This app uses @expo/ui/swift-ui which is iOS-specific.
        </Text>
        <Text style={styles.warningDescription}>
          Please run on an iOS device or simulator.
        </Text>
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  platformWarning: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  warningText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  warningDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
});
