// app/(app)/_layout.tsx 

import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack>
      {/* Aponta para o arquivo exato e deixa o layout de turmas controlar o header */}
      <Stack.Screen 
        name="turmas/index" 
        options={{ title: 'Turmas' }} 
      />
      {/* Define as outras telas e seus títulos */}
      <Stack.Screen name="alunos/index" options={{ title: 'Alunos' }} />
      <Stack.Screen name="chamada/index" options={{ title: 'Realizar Chamada' }} />
    </Stack>
  );
}