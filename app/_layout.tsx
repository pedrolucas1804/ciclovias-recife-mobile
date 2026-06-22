import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CicloviasProvider } from '../contexts/CicloviasContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CicloviasProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </CicloviasProvider>
    </SafeAreaProvider>
  );
}