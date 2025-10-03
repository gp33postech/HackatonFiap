// app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../src/config/firebase';


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
    const inAppGroup = segments[0] === '(app)';

    // Só redireciona para login se não estiver nem em auth nem em app
    if (!inAuthGroup && !inAppGroup && segments.length > 0) {
      router.replace('/(auth)/login');
    }
    // Permite navegação livre entre (auth) e (app)
  }, [loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* 1. Tela de Login  */}
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: 'Gestão de Professores',
            headerShown: false, 
            
          }}
        />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
     
      </Stack>
    </AuthProvider>
  );
}