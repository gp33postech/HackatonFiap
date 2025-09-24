// app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Exemplo de ícones

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="turmas" // Corresponde ao arquivo turmas.tsx
        options={{
          title: 'Turmas',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={28} color={color} />,
          headerShown: false, // O cabeçalho já está na tela
        }}
      />
      <Tabs.Screen
        name="chamada" // Corresponde ao arquivo chamada.tsx
        options={{
          title: 'Chamada',
          tabBarIcon: ({ color }) => <Ionicons name="checkbox-outline" size={28} color={color} />,
        }}
      />
       {/* Adicione outras abas aqui se precisar */}
       {/* O arquivo index.tsx dentro de (tabs) seria a tela inicial das abas */}
       <Tabs.Screen name="index" options={{ href: null }} /> 
    </Tabs>
  );
}