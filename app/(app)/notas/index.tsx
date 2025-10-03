import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {Alert,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface Nota {
  id: string;
  aluno: string;
  disciplina: string;
  nota: number;
  tipo: string;
  data: string;
}

export default function NotasScreen() {
  const [searchText, setSearchText] = useState('');
  const [notas, setNotas] = useState<Nota[]>([
    {
      id: '1',
      aluno: 'João Silva',
      disciplina: 'Matemática',
      nota: 8.5,
      tipo: 'Prova',
      data: '15/09/2024'
    },
    {
      id: '2',
      aluno: 'Maria Santos',
      disciplina: 'Português',
      nota: 9.2,
      tipo: 'Trabalho',
      data: '18/09/2024'
    },
    {
      id: '3',
      aluno: 'Pedro Costa',
      disciplina: 'História',
      nota: 7.8,
      tipo: 'Prova',
      data: '20/09/2024'
    },
    {
      id: '4',
      aluno: 'Ana Oliveira',
      disciplina: 'Ciências',
      nota: 9.5,
      tipo: 'Apresentação',
      data: '22/09/2024'
    },
  ]);

  const filteredNotas = notas.filter(nota =>
    nota.aluno.toLowerCase().includes(searchText.toLowerCase()) ||
    nota.disciplina.toLowerCase().includes(searchText.toLowerCase())
  );

  const getNotaColor = (nota: number) => {
    if (nota >= 9) return '#4CAF50'; // Verde
    if (nota >= 7) return '#FF9800'; // Laranja
    return '#F44336'; // Vermelho
  };

  const handleAddNota = () => {
    Alert.alert('Nova Nota', 'Funcionalidade de adicionar nota será implementada em breve.');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Search Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Buscar Notas</Text>
        <View style={styles.formSection}>
          <Text style={styles.label}>Buscar por aluno ou disciplina</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do aluno ou disciplina..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Notas List Card */}
      <View style={[styles.card, { flex: 1, marginTop: 16, marginBottom: 40 }]}>
        <Text style={styles.title}>Lista de Notas</Text>
        <ScrollView 
          showsVerticalScrollIndicator={false}
        >
          {filteredNotas.map((nota) => (
            <View key={nota.id} style={styles.notaCard}>
              <View style={styles.notaHeader}>
                <Text style={styles.alunoName}>{nota.aluno}</Text>
                <View style={[styles.notaBadge, { backgroundColor: getNotaColor(nota.nota) }]}>
                  <Text style={styles.notaValue}>{nota.nota.toFixed(1)}</Text>
                </View>
              </View>
              
              <View style={styles.notaDetails}>
                <View style={styles.notaInfo}>
                  <Ionicons name="book-outline" size={16} color="#666" />
                  <Text style={styles.disciplina}>{nota.disciplina}</Text>
                </View>
                
                <View style={styles.notaInfo}>
                  <Ionicons name="document-text-outline" size={16} color="#666" />
                  <Text style={styles.tipo}>{nota.tipo}</Text>
                </View>
                
                <View style={styles.notaInfo}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.data}>{nota.data}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                  <Ionicons name="create-outline" size={18} color="#4A90E2" />
                  <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {filteredNotas.length === 0 && (
            <Text style={styles.warningAlert}>
              {searchText ? 'Nenhuma nota encontrada.' : 'Nenhuma nota cadastrada.'}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5',
    padding: 8, 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 8, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  formSection: { 
    marginBottom: 16 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 8 
  },
  input: { 
    height: 44, 
    borderColor: '#ced4da', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: 12, 
    fontSize: 16 
  },
  warningAlert: { 
    padding: 12, 
    backgroundColor: '#fff3cd', 
    color: '#856404', 
    textAlign: 'center', 
    borderRadius: 5,
    marginTop: 8,
  },
  notaCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alunoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  notaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notaValue: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notaDetails: {
    marginBottom: 12,
  },
  notaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  disciplina: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tipo: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  data: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});