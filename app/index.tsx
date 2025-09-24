// app/index.tsx

import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

// Reutilize seus componentes temáticos para manter a consistência!
import { ThemedText } from '../src/components/themed-text';
import { ThemedView } from '../src/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Tela Principal</ThemedText>
      <ThemedText style={styles.subtitle}>
        Esta é a tela de boas-vindas do seu aplicativo.
      </ThemedText>

      {/* Este Link navega para a rota '/modal' */}
      <Link href="/modal" style={styles.link}>
        <ThemedText type="link">Abrir a tela Modal</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});