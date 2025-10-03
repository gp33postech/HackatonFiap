// src/hooks/use-Color-scheme.ts

import { useColorScheme as _useColorScheme } from 'react-native';

// Este hook simplesmente repassa o hook do React Native.
// A existência deste arquivo é para fácil customização futura.
export default function useColorScheme(): 'light' | 'dark' | null {
  return _useColorScheme() as any;
}