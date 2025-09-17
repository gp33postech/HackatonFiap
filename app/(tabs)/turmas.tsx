import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Importa o store.js - Ajuste o caminho conforme a estrutura do seu projeto!
import { store } from '../../src/store';

export default function TurmasScreen() {
  // Estado para o input de nova turma
  const [newTurmaName, setNewTurmaName] = useState('');
  // Estado para a lista de turmas
  const [turmasList, setTurmasList] = useState<{ id: string; nome: string; alunosCount?: number }[]>([]);
  // Estado para o input de novo aluno
  const [newAlunoName, setNewAlunoName] = useState('');
  // Estado para a turma selecionada na coluna de alunos
  const [selectedTurmaForStudents, setSelectedTurmaForStudents] = useState<string | null>(null);
  // Estado para a lista de alunos da turma selecionada
  const [studentsList, setStudentsList] = useState([]);
  // Estado para controle de carregamento/atualização (pull-to-refresh)
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar todas as turmas e atualizar o estado
  const loadTurmas = useCallback(async () => {
    setRefreshing(true);
    try {
      const loadedTurmas = await store.listTurmas();
      
      // Otimização: Calcular alunosCount uma única vez aqui
      const allData = store.get && typeof store.get === 'function' ? store.get() as { alunos?: { turmaId: string }[] } : {};
      const turmasWithCounts = loadedTurmas.map((turma: { id: string; nome: string }) => {
        const alunoCount = (allData.alunos ?? []).filter((a: { turmaId: string }) => a.turmaId === turma.id).length;
        return { ...turma, alunosCount: alunoCount };
      });

      setTurmasList(turmasWithCounts);
      
      // Se não houver turma selecionada, selecione a primeira, se houver
      if (!selectedTurmaForStudents && turmasWithCounts.length > 0) {
        setSelectedTurmaForStudents(turmasWithCounts[0].id);
      } else if (turmasWithCounts.length === 0) {
        setSelectedTurmaForStudents(null);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    } finally {
      setRefreshing(false);
    }
  }, [selectedTurmaForStudents]); // selectedTurmaForStudents é uma dependência devido à lógica de seleção inicial

  // Função para carregar os alunos da turma selecionada
  const loadStudents = useCallback(async () => {
    if (!selectedTurmaForStudents) {
      setStudentsList([]);
      return;
    }
    setRefreshing(true);
    try {
      const loadedStudents = await store.listAlunosByTurma(selectedTurmaForStudents);
      setStudentsList(loadedStudents);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      Alert.alert("Erro", "Não foi possível carregar os alunos da turma selecionada.");
    } finally {
      setRefreshing(false);
    }
  }, [selectedTurmaForStudents]);

  // Carregar turmas e alunos ao montar e quando selectedTurmaForStudents muda
  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // --- Funções de Ação ---

  const handleAddTurma = async () => {
    if (!newTurmaName.trim()) {
      Alert.alert('Atenção', 'Informe o nome da turma.');
      return;
    }
    await store.addTurma(newTurmaName.trim());
    setNewTurmaName('');
    await loadTurmas(); // Recarregar turmas (já incluirá a contagem de alunos)
    await loadStudents(); // Recarregar alunos para garantir que a lista esteja atualizada, especialmente se a turma recém-criada for selecionada.
  };

  const handleDeleteTurma = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Excluir turma? Isso também removerá todos os alunos e chamadas associadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            await store.deleteTurma(id);
            await loadTurmas(); // Recarregar turmas (com contagem atualizada e possível nova seleção)
            await loadStudents(); // Recarregar alunos da turma potencialmente selecionada
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleAddAluno = async () => {
    if (!selectedTurmaForStudents) {
      Alert.alert('Atenção', 'Selecione uma turma para adicionar o aluno.');
      return;
    }
    if (!newAlunoName.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno.');
      return;
    }
    await store.addAluno(newAlunoName.trim(), selectedTurmaForStudents);
    setNewAlunoName('');
    await loadStudents(); // Recarregar apenas os alunos da turma selecionada
    await loadTurmas(); // Também recarregar turmas para atualizar a contagem de alunos
  };

  const handleDeleteAluno = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Remover aluno desta turma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: async () => {
            await store.deleteAluno(id);
            await loadStudents(); // Recarregar apenas os alunos da turma selecionada
            await loadTurmas(); // Também recarregar turmas para atualizar a contagem de alunos
          },
          style: 'destructive',
        },
      ]
    );
  };

  // --- Renderização ---

  const renderTurmaItem = ({ item }: { item: { id: string; nome: string; alunosCount?: number } }) => {
    // alunosCount já está presente no item devido à otimização em loadTurmas
    const alunosCountDisplay = item.alunosCount || 0; 
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 3, fontWeight: 'normal', textAlign: 'left' }]}>{item.nome}</Text>
        {/* Usando View para envolver o badge, centralizado na célula */}
        <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${alunosCountDisplay} aluno(s)`}</Text>
          </View>
        </View>
        {/* Botão Excluir usando TouchableOpacity com estilos customizados */}
        <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity
            onPress={() => handleDeleteTurma(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAlunoItem = ({ item }: { item: { id: string; nome: string } }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 3, fontWeight: 'normal', textAlign: 'left' }]}>{item.nome}</Text>
      {/* Botão Remover usando TouchableOpacity com estilos customizados (reutilizando deleteButton) */}
      <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity
          onPress={() => handleDeleteAluno(item.id)}
          style={styles.deleteButton} // Reutilizando o estilo do botão de exclusão
        >
          <Text style={styles.deleteButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { await loadTurmas(); await loadStudents(); }} />
      }
    >
      {/* Coluna 1: Gerenciar Turmas */}
      <View style={styles.card}>
        <Text style={styles.title}>Gerenciar Turmas</Text>
        <Text style={styles.mutedText}>Crie turmas e gerencie sua lista de alunos.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da turma</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 3ºA - Matemática"
            value={newTurmaName}
            onChangeText={setNewTurmaName}
          />
          <View style={styles.buttonSpacing}>
            <Button title="Adicionar Turma" onPress={handleAddTurma} color="#007bff" />
          </View>
        </View>

        <View style={styles.tableSection}>
          <Text style={styles.subTitle}>Turmas Cadastradas</Text>
          {turmasList.length === 0 ? (
            <Text style={styles.infoAlert}>Nenhuma turma cadastrada.</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 3, textAlign: 'left' }]}>Turma</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Alunos</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Ações</Text>
              </View>
              <FlatList
                data={turmasList} // Usar turmasList diretamente, já com alunosCount
                keyExtractor={(item) => item.id}
                renderItem={renderTurmaItem}
                scrollEnabled={false} // Desabilitar scroll interno para o FlatList dentro do ScrollView
              />
            </View>
          )}
        </View>
      </View>

      {/* Coluna 2: Gerenciar Alunos */}
      <View style={styles.card}>
        <Text style={styles.title}>Gerenciar Alunos</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Turma</Text>
          {turmasList.length === 0 ? (
            <Text style={styles.pickerDisabled}>Nenhuma turma cadastrada</Text>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTurmaForStudents}
                onValueChange={(itemValue) => setSelectedTurmaForStudents(itemValue as string)}
                style={styles.picker}
              >
                {turmasList.map((turma) => (
                  <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do aluno</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Maria Silva"
            value={newAlunoName}
            onChangeText={setNewAlunoName}
            editable={!!selectedTurmaForStudents} // Só editável se houver turma selecionada
          />
          <View style={styles.buttonSpacing}>
            <Button
              title="Adicionar Aluno"
              onPress={handleAddAluno}
              color="#007bff"
              disabled={!selectedTurmaForStudents}
            />
          </View>
        </View>

        <View style={styles.tableSection}>
          <Text style={styles.subTitle}>Alunos da turma selecionada</Text>
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
              <FlatList
                data={studentsList}
                keyExtractor={(item) => item.id}
                renderItem={renderAlunoItem}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 10,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 20, // Aumentado para maior destaque
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  mutedText: {
    fontSize: 12, // Ajustado para ser legível
    color: '#6c757d',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  // Ajuste de fontSize para TextInput
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16, // <<<< Ajustado para 16px para consistência
  },
  buttonSpacing: {
    marginTop: 10,
  },
  pickerContainer: {
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // Ajuste de fontSize para Picker
  picker: {
    height: 80,
    width: '100%',
    fontSize: 6, // <<<< Ajustado para 16px para consistência e visibilidade
  },
  pickerDisabled: {
    borderColor: '#e9ecef',
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#6c757d',
    fontSize: 14,
    height: 40,
    textAlignVertical: 'center',
  },
  tableSection: {
    marginTop: 20,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center', // Alinhar itens no centro vertical
  },
  // Ajuste de paddingHorizontal para espaçamento dos botões
  tableCell: {
    // flex é definido individualmente no componente
    paddingHorizontal: 10, // <<<< Aumentado para 10 para criar mais espaço horizontal
    fontSize: 16, // Tamanho de fonte padrão para células de texto
  },
  badge: {
    backgroundColor: '#007bff', // Cor do badge primário
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    minWidth: 80, // Garante que o badge tenha uma largura mínima
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Estilos para os botões de exclusão/remover (Excluir Turma e Remover Aluno)
  deleteButton: {
    backgroundColor: '#dc3545', // Cor vermelha para exclusão
    borderRadius: 12, // Mesmo border radius que o badge
    paddingHorizontal: 8,
    paddingVertical: 10, // Mesmo padding vertical que o badge
    minWidth: 70, // Mesmo minWidth que o badge para consistência visual
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12, // Mesmo tamanho de fonte que o badgeText
    fontWeight: 'bold', // Mesmo peso de fonte que o badgeText
  },
  infoAlert: {
    color: '#0c5460',
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
  warningAlert: {
    color: '#856404',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
});