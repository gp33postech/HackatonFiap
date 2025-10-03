// app/(app)/alunos/index.tsx

import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {Alert, Button, FlatList, StyleSheet, Text, TextInput,TouchableOpacity, View, RefreshControl} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { store, Aluno, Turma } from '../../../src/services/store';
//import { router } from 'expo-router';

export default function GerenciarAlunosScreen() {
  const [turmasList, setTurmasList] = useState<Turma[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null);
  const [studentsList, setStudentsList] = useState<Aluno[]>([]);
  const [newAlunoName, setNewAlunoName] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // --- LÓGICA DE DADOS (sem alterações) ---
  const loadTurmas = useCallback(async () => {
    try {
      const loadedTurmas = await store.listTurmas();
      setTurmasList(loadedTurmas);
      if (!selectedTurma && loadedTurmas.length > 0) {
        setSelectedTurma(loadedTurmas[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  }, [selectedTurma]);

  const loadStudents = useCallback(async () => {
    if (!selectedTurma) {
      setStudentsList([]);
      return;
    }
    setRefreshing(true);
    try {
      const loadedStudents = await store.listAlunosByTurma(selectedTurma);
      setStudentsList(loadedStudents);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedTurma]);

useEffect(() => { loadTurmas(); }, [loadTurmas]);
useEffect(() => { loadStudents(); }, [selectedTurma, loadStudents]);

  const handleAddAluno = async () => {
    if (!selectedTurma || !newAlunoName.trim()) return;
    await store.addAluno(newAlunoName.trim(), selectedTurma);
    setNewAlunoName('');
    await loadStudents();
  };

  const handleDeleteAluno = async (alunoId: string) => {
    Alert.alert('Confirmar Exclusão', 'Remover este aluno da turma?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        onPress: async () => {
          await store.deleteAluno(alunoId);
          await loadStudents();
        },
        style: 'destructive',
      },
    ]);
  };
  
  // --- NOVOS COMPONENTES DE RENDERIZAÇÃO PARA A TABELA ---

  const TabelaAlunosHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 3 }]}>Aluno</Text>
      <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'center' }]}>Ações</Text>
    </View>
  );

  const renderAlunoItem = ({ item }: { item: Aluno }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 3 }]}>{item.nome}</Text>
      <View style={{ flex: 1.5, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handleDeleteAluno(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.title}>Gerenciar Alunos</Text>
        
        <View style={styles.formSection}>
          <Text style={styles.label}>Selecione a Turma</Text>
          {turmasList.length === 0 ? (
            <Text style={styles.pickerDisabled}>Nenhuma turma cadastrada.</Text>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTurma}
                onValueChange={(itemValue) => setSelectedTurma(itemValue)}
              >
                {turmasList.map((turma) => (
                  <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Adicionar Novo Aluno</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do aluno"
            value={newAlunoName}
            onChangeText={setNewAlunoName}
            editable={!!selectedTurma}
          />
          <View style={styles.buttonSpacing}>
            <Button
              title="Adicionar Aluno"
              onPress={handleAddAluno}
              disabled={!selectedTurma}
              color="#007bff"
            />
          </View>
        </View>
      </View>

      {/* CARD 2: TABELA DE ALUNOS */}
      <View style={[styles.card, { flex: 1, marginTop: 16,marginBottom: 40}]}>
        <Text style={styles.title}>Alunos da Turma</Text>
        <FlatList
          data={studentsList}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={TabelaAlunosHeader}
          renderItem={renderAlunoItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStudents} />}
          ListEmptyComponent={
            <Text style={styles.warningAlert}>
              {selectedTurma ? 'Nenhum aluno cadastrado.' : 'Selecione uma turma.'}
            </Text>
          }
        />
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
  buttonSpacing: { 
    marginTop: 10 
  },
  pickerContainer: { 
    borderColor: '#ced4da', 
    borderWidth: 1, 
    borderRadius: 5, 
    justifyContent: 'center' 
  },
  pickerDisabled: { 
    padding: 12, 
    backgroundColor: '#e9ecef', 
    color: '#6c757d', 
    borderRadius: 5 
  },
  warningAlert: { 
    padding: 12, 
    backgroundColor: '#fff3cd', 
    color: '#856404', 
    textAlign: 'center', 
    borderRadius: 5,
    marginTop: 8,
  },
  
   tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
   tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tableCell: {
    fontSize: 16,
    color: '#212529',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});