// app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router';
import  { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../src/config/firebase'; // Corrija o caminho se necessário
import { ActivityIndicator, View } from 'react-native';

// Componente AuthProvider para gerenciar o estado de autenticação
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Se não há usuário e não estamos na rota de login, redireciona para lá
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Se o usuário está logado e na tela de login, vai para a tela principal (tabs)
      router.replace('/(tabs)/turmas');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

// Layout principal da aplicação
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* As telas de abas e modal são gerenciadas pelos seus próprios layouts */}
         <Stack.Screen
          name="login" 
          options={{
            title: 'Gestão de Professores',
            headerShown: true, 
            headerStyle: {
              backgroundColor: '#e9ecef', 
            },
            headerTintColor: '#000', 
            headerTitleStyle: {
              fontWeight: 'bold', // Estilo do título
            },
            headerShadowVisible: false, 
          }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        
      </Stack>
    </AuthProvider>
  );
}