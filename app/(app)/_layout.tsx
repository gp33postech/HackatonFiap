// app/(app)/_layout.tsx 

import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack>
      {/* Tela principal do menu */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Menu Principal',
          headerShown: false 
        }} 
      />
      {/* Telas das funcionalidades */}
      <Stack.Screen 
        name="turmas/index" 
        options={{ 
          title: 'Turmas',
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="alunos/index" 
        options={{ 
          title: 'Alunos',
          headerStyle: {
            backgroundColor: '#50C878',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="chamada/index" 
        options={{ 
          title: 'Realizar Chamada',
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="notas/index" 
        options={{ 
          title: 'Notas',
          headerStyle: {
            backgroundColor: '#9B59B6',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="agenda/index" 
        options={{ 
          title: 'Agenda',
          headerStyle: {
            backgroundColor: '#E67E22',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="avisos/index" 
        options={{ 
          title: 'Avisos',
          headerStyle: {
            backgroundColor: '#3498DB',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack>
  );
}