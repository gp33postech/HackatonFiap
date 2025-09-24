// src/hooks/useThemeColor.ts

import useColorScheme from './useColorScheme'; // Usa o nosso interruptor local!
import { Colors } from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light'; // Descobre o tema atual
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Busca na nossa paleta de cores o valor correto para o tema atual
    return Colors[theme][colorName];
  }
}