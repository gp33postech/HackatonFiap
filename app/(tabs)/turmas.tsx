import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl } from 'react-native';

import { store, Turma, Aluno } from '../../src/services/store';

interface TurmaComContador extends Turma {
  alunosCount: number;
}

export default function TurmasScreen() {
  const [newTurmaName, setNewTurmaName] = useState<string>('');
  const [turmasList, setTurmasList] = useState<TurmaComContador[]>([]);
  const [newAlunoName, setNewAlunoName] = useState<string>('');
  const [selectedTurmaForStudents, setSelectedTurmaForStudents] = useState<string | number | null>(null);
  const [studentsList, setStudentsList] = useState<Aluno[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isInitialMount = useRef(true); // Para controlar a carga inicial

  const loadTurmas = useCallback(async () => {
    try {
      const loadedTurmas = await store.listTurmas();
      const allData = await store.get();
      
      const turmasWithCounts: TurmaComContador[] = loadedTurmas.map((turma) => {
        const alunoCount = allData.alunos.filter((a) => a.turmaId === turma.id).length;
        return { ...turma, alunosCount: alunoCount };
      });

      setTurmasList(turmasWithCounts);
      
      // Define a primeira turma como selecionada apenas na carga inicial
      if (isInitialMount.current && turmasWithCounts.length > 0) {
        setSelectedTurmaForStudents(turmasWithCounts[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    }
  }, []); // Sem dependências, executa a mesma lógica sempre

  const loadStudents = useCallback(async () => {
    if (!selectedTurmaForStudents) {
      setStudentsList([]);
      return;
    }
    try {
      const loadedStudents = await store.listAlunosByTurma(selectedTurmaForStudents);
      setStudentsList(loadedStudents);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      Alert.alert("Erro", "Não foi possível carregar os alunos.");
    }
  }, [selectedTurmaForStudents]);

  const reloadData = useCallback(async () => {
    setRefreshing(true);
    await loadTurmas();
    // loadStudents será chamado pelo useEffect que observa selectedTurmaForStudents
    setRefreshing(false);
  }, [loadTurmas]);

  // Efeito para carga inicial
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Efeito para carregar alunos quando a turma selecionada muda
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false; // Marca que a montagem inicial já passou
    }
    loadStudents();
  }, [loadStudents]);

  // --- Funções de Ação (Handlers) ---
  const handleAddTurma = async () => {
    if (!newTurmaName.trim()) return;
    await store.addTurma(newTurmaName.trim());
    setNewTurmaName('');
    await reloadData();
  };

  const handleDeleteTurma = async (id: string | number) => {
    Alert.alert('Confirmar Exclusão', 'Isso também removerá todos os alunos e chamadas associadas.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          await store.deleteTurma(id as string);
          await reloadData();
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddAluno = async () => {
    if (!selectedTurmaForStudents || !newAlunoName.trim()) return;
    await store.addAluno(newAlunoName.trim(), selectedTurmaForStudents as string);
    setNewAlunoName('');
    await Promise.all([loadTurmas(), loadStudents()]); // Recarrega ambos para atualizar contagem e lista
  };

  const handleDeleteAluno = async (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Remover aluno desta turma?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        onPress: async () => {
          await store.deleteAluno(id);
          await Promise.all([loadTurmas(), loadStudents()]); // Recarrega ambos
        },
        style: 'destructive',
      },
    ]);
  };

  // --- Componentes de Renderização ---
  const renderTurmaItem = ({ item }: { item: TurmaComContador }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 3, textAlign: 'left' }, { fontSize: 16 }]}>{item.nome}</Text>
      <View style={[styles.tableCell, { flex: 1, alignItems: 'center' }]}>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { fontSize: 16 }]}>{`${item.alunosCount} aluno(s)`}</Text>
        </View>
      </View>
      <View style={[styles.tableCell, { flex: 1, alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => handleDeleteTurma(item.id)} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Excluir</Text></TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Gerenciar Turmas</Text>
      <Text style={styles.mutedText}>Crie turmas para organizar seus alunos.</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome da turma</Text>
        <TextInput style={styles.input} placeholder="Ex.: 3ºA - Matemática" value={newTurmaName} onChangeText={setNewTurmaName} />
        <View style={styles.buttonSpacing}><Button title="Adicionar Turma" onPress={handleAddTurma} color="#007bff" /></View>
      </View>
      <View style={styles.tableSection}>
        <Text style={styles.subTitle}>Turmas Cadastradas</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={[styles.card, { marginTop: 0 }]}>
      <Text style={styles.title}>Gerenciar Alunos</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Selecione a Turma</Text>
        {turmasList.length === 0 ? (
          <Text style={styles.pickerDisabled}>Primeiro, crie uma turma.</Text>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedTurmaForStudents ?? undefined} onValueChange={(itemValue) => setSelectedTurmaForStudents(itemValue)}>
              {turmasList.map((turma) => <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />)}
            </Picker>
          </View>
        )}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do aluno</Text>
        <TextInput style={styles.input} placeholder="Ex.: Maria Silva" value={newAlunoName} onChangeText={setNewAlunoName} editable={!!selectedTurmaForStudents} />
        <View style={styles.buttonSpacing}><Button title="Adicionar Aluno" onPress={handleAddAluno} color="#007bff" disabled={!selectedTurmaForStudents} /></View>
      </View>
      <View style={styles.tableSection}>
        <Text style={styles.subTitle}>Alunos da Turma</Text>
        {!selectedTurmaForStudents ? (
          <Text style={styles.infoAlert}>Selecione uma turma para ver os alunos.</Text>
        ) : studentsList.length === 0 ? (
          <Text style={styles.warningAlert}>Nenhum aluno cadastrado nesta turma.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 3, textAlign: 'left' }]}>Aluno</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Ações</Text>
            </View>
            {studentsList.map(item => <View key={item.id}><RenderAlunoItem item={item} /></View>)}
          </View>
        )}
      </View>
    </View>
  );

  // Componente interno para evitar problemas de escopo no map
  const RenderAlunoItem = ({ item }: { item: Aluno }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 3, textAlign: 'left' }]}>{item.nome}</Text>
      <View style={[styles.tableCell, { flex: 1, alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => handleDeleteAluno(item.id)} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Remover</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={turmasList}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTurmaItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text style={styles.infoAlert}>Nenhuma turma cadastrada.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reloadData} />}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    contentContainer: { paddingHorizontal: 16, paddingVertical: 8 },
    card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, elevation: 3 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    subTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 16 },
    mutedText: { fontSize: 14, color: '#6c757d', marginBottom: 16 },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
    input: { height: 44, borderColor: '#ced4da', borderWidth: 1, borderRadius: 5, paddingHorizontal: 12, fontSize: 16 },
    buttonSpacing: { marginTop: 10 },
    pickerContainer: { borderColor: '#ced4da', borderWidth: 1, borderRadius: 5, height: 44, justifyContent: 'center' },
    pickerDisabled: { height: 44, justifyContent: 'center', backgroundColor: '#e9ecef', paddingHorizontal: 12, borderRadius: 5, color: '#6c757d' },
    tableSection: { marginTop: 20 },
    table: { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 5 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#f8f9fa', padding: 10, borderBottomWidth: 1, borderColor: '#dee2e6' },
    headerCell: { fontWeight: 'bold', color: '#495057' },
    tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#e9ecef', alignItems: 'center' },
    tableCell: {},
    badge: { backgroundColor: '#007bff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    deleteButton: { backgroundColor: '#dc3545', borderRadius: 5, paddingHorizontal: 12, paddingVertical: 6 },
    deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    infoAlert: { padding: 12, backgroundColor: '#d1ecf1', color: '#0c5460', textAlign: 'center', borderRadius: 5, margin: 16 },
    warningAlert: { padding: 12, backgroundColor: '#fff3cd', color: '#856404', textAlign: 'center', borderRadius: 5 },
});