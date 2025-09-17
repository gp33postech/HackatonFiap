// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native'; // Importe Text para usar com os ícones de emoji
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'blue', // Usando uma cor fixa para simplicidade
          headerShown: false, // Oculta o cabeçalho padrão
        }}>
        <Tabs.Screen
          name="turmas" // Nova aba para Turmas
          options={{
            title: 'Turmas',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏫</Text>, // Ícone de escola
          }}
        />
        <Tabs.Screen
          name="chamada" // Nova aba para Chamada (placeholder por enquanto)
          options={{
            title: 'Chamada',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>��</Text>, // Ícone de prancheta
          }}
        />
         <Tabs.Screen
          name="index" // Esta é a sua página de Relatórios
          options={{
            title: 'Relatórios',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>��</Text>, // Ícone de gráfico
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}