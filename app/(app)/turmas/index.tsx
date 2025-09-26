// app/(app)/turmas/index.tsx

//import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {Alert, Button, FlatList, StyleSheet, Text, TextInput,TouchableOpacity, View, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, Turma } from '../../../src/services/store';

interface TurmaComContador extends Turma {
  alunosCount: number;
}

export default function ListaTurmasScreen() {
  //const router = useRouter(); CASO ARRUME PRECISE COLOCAR ROTA
  const [newTurmaName, setNewTurmaName] = useState<string>('');
  const [turmasList, setTurmasList] = useState<TurmaComContador[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // --- LÓGICA DE DADOS (mesma de antes) ---
  const loadTurmas = useCallback(async () => {
    setRefreshing(true);
    try {
      const loadedTurmas = await store.listTurmas();
      const allData = await store.get();
      
      const turmasWithCounts: TurmaComContador[] = loadedTurmas.map((turma) => ({
        ...turma,
        alunosCount: allData.alunos.filter((a) => a.turmaId === turma.id).length,
      }));

      setTurmasList(turmasWithCounts);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  const handleAddTurma = async () => {
    if (!newTurmaName.trim()) return;
    await store.addTurma(newTurmaName.trim());
    setNewTurmaName('');
    await loadTurmas();
  };

  const handleDeleteTurma = async (id: string | number) => {
    Alert.alert('Confirmar Exclusão', 'Isso também removerá todos os alunos e chamadas associadas.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          await store.deleteTurma(id as string);
          await loadTurmas();
        },
        style: 'destructive',
      },
    ]);
  };

  const TabelaHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 3 }]}>Turma</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Alunos</Text>
      <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'center' }]}>Ações</Text>
    </View>
  );

  const renderTurmaItem = ({ item }: { item: TurmaComContador }) => (
    <TouchableOpacity 
      style={styles.tableRow} 
      onPress={() => console.log('Clicou na turma', item.id)} 
    >
      <Text style={[styles.tableCell, { flex: 3 }]}>{item.nome}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.alunosCount} Alunos</Text>
      <View style={{ flex: 1.5, alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => handleDeleteTurma(item.id)} 
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Formulário para adicionar turmas continua o mesmo */}
      <View style={styles.card}>
        <Text style={styles.title}>Adicionar Nova Turma</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da turma</Text>
          <TextInput style={styles.input} placeholder="Ex.: 3ºA - Matemática" value={newTurmaName} onChangeText={setNewTurmaName} />
          <View style={styles.buttonSpacing}>
            <Button title="Adicionar Turma" onPress={handleAddTurma} color="#007bff" />
          </View>
        </View>
      </View>
      
      {/* A lista agora é a tabela */}
      <View style={styles.card}>
         <Text style={styles.title}>Turmas Cadastradas</Text>
        <FlatList
          data={turmasList}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={TabelaHeader} // Cabeçalho da tabela
          renderItem={renderTurmaItem}      // Linhas da tabela
          ListEmptyComponent={<Text style={styles.infoAlert}>Nenhuma turma cadastrada.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTurmas} />}
        />
      </View>
    </SafeAreaView>
  );
}

// --- NOVOS ESTILOS PARA A TABELA ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5',
    padding: 16,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 16, 
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
  formGroup: { 
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
  infoAlert: { 
    padding: 12, 
    backgroundColor: '#d1ecf1', 
    color: '#0c5460', 
    textAlign: 'center', 
    borderRadius: 5, 
    marginTop: 16 
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
    backgroundColor: '#df3636ff', // Cor preta como na imagem
    borderRadius: 15, // Bem arredondado
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});