import { Platform } from 'react-native';

const FALLBACK = Platform.select({
ios: 'http://localhost:3000',       // Use Expo tunnel URL in dev if needed
android: 'http://10.0.2.2:3000',    // Android emulator
default: 'http://localhost:3000',
});

export const CONFIG = {
API_BASE_URL: (process.env.API_BASE_URL as string) || FALLBACK,
};