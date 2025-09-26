// app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router';
import  { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../src/config/firebase'; 
import { ActivityIndicator, View } from 'react-native';


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
     
      router.replace('/login');
    } else if (user && inAuthGroup) {
      
      router.replace('/alunos');
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