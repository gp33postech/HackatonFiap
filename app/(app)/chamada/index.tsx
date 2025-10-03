// app/(tabs)/chamada.tsx
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {ActivityIndicator,Alert,Platform,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { store, Chamada } from '../../../src/services/store';


interface CheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={checkboxStyles.checkboxContainer}
      onPress={() => onValueChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
    >
      <View style={[checkboxStyles.checkbox, value && checkboxStyles.checkboxChecked]}>
        {value && <Text style={checkboxStyles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const checkboxStyles = StyleSheet.create({
  checkboxContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const formatDate = (isoDate: string) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export default function ChamadaScreen() {
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [alunosDaTurma, setAlunosDaTurma] = useState<{ id: string; nome: string }[]>([]);
  const [alunosPresentes, setAlunosPresentes] = useState<{ [alunoId: string]: boolean }>({});
  const [chamadasRecentes, setChamadasRecentes] = useState<Chamada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTurmas = useCallback(async () => {
    try {
      const loadedTurmas = await store.listTurmas();
      setTurmas(loadedTurmas);
      if (loadedTurmas.length > 0) {
        if (!selectedTurmaId || !loadedTurmas.some((t: { id: string; nome: string }) => t.id === selectedTurmaId)) {
          setSelectedTurmaId(loadedTurmas[0].id);
        }
      } else {
        setSelectedTurmaId(null);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
      setTurmas([]);
      setSelectedTurmaId(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTurmaId]);

  const loadAlunosAndChamada = useCallback(async () => {
    if (!selectedTurmaId || !selectedDate) {
      setAlunosDaTurma([]);
      setAlunosPresentes({});
      return;
    }

    try {
      const alunos = await store.listAlunosByTurma(selectedTurmaId);
      setAlunosDaTurma(alunos);

      const chamadaExistente = await store.obterChamada(selectedTurmaId, selectedDate);
      if (chamadaExistente && chamadaExistente.presencas) {
        setAlunosPresentes(chamadaExistente.presencas);
      } else {
        const initialPresences: { [alunoId: string]: boolean } = {};
        alunos.forEach((aluno: { id: string; nome: string }) => {
          initialPresences[aluno.id] = true;
        });
        setAlunosPresentes(initialPresences);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos ou chamada:", error);
      Alert.alert("Erro", "Não foi possível carregar os alunos ou a chamada.");
      setAlunosDaTurma([]);
      setAlunosPresentes({});
    }
  }, [selectedTurmaId, selectedDate]);

  const loadChamadasRecentes = useCallback(async () => {
    if (!selectedTurmaId) {
      setChamadasRecentes([]);
      return;
    }
    try {
      const recentCalls = await store.listarChamadasPorTurma(selectedTurmaId);
      setChamadasRecentes(
        recentCalls.sort(
          (
            a: { dataISO: string; presencas: { [alunoId: string]: boolean } },
            b: { dataISO: string; presencas: { [alunoId: string]: boolean } }
          ) => b.dataISO.localeCompare(a.dataISO)
        )
      );
    } catch (error) {
      console.error("Erro ao carregar chamadas recentes:", error);
      Alert.alert("Erro", "Não foi possível carregar as chamadas recentes.");
      setChamadasRecentes([]);
    }
  }, [selectedTurmaId]);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  useEffect(() => {
    if (selectedTurmaId) {
      loadAlunosAndChamada();
      loadChamadasRecentes();
    } else {
      setAlunosDaTurma([]);
      setAlunosPresentes({});
      setChamadasRecentes([]);
    }
  }, [selectedTurmaId, selectedDate, loadAlunosAndChamada, loadChamadasRecentes]);

  const handleTogglePresence = (alunoId: string) => {
    setAlunosPresentes(prev => ({
      ...prev,
      [alunoId]: !prev[alunoId],
    }));
  };

  const salvarChamada = async () => {
    if (!selectedTurmaId) {
      Alert.alert('Erro', 'Selecione uma turma para registrar a chamada.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Erro', 'Selecione a data da chamada.');
      return;
    }
    if (alunosDaTurma.length === 0) {
      Alert.alert('Erro', 'Esta turma não possui alunos cadastrados para registrar a chamada.');
      return;
    }

    try {
      await store.registrarChamada(selectedTurmaId, selectedDate, alunosPresentes);
      Alert.alert('Sucesso', 'Chamada salva com sucesso!');
      loadChamadasRecentes();
    } catch (error) {
      console.error("Erro ao salvar chamada:", error);
      Alert.alert('Erro', 'Não foi possível salvar a chamada.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {/* Coluna 1: Registrar Chamada */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Registrar Chamada</Text>

            <View style={styles.formRow}>
              <View style={styles.formControl}>
                <Text style={styles.label}>Turma</Text>
                <View style={styles.pickerContainer}>
                  {turmas.length > 0 ? (
                    <Picker
                      selectedValue={selectedTurmaId}
                      onValueChange={(itemValue) => setSelectedTurmaId(itemValue as string)}
                      style={styles.picker}
                      enabled={turmas.length > 0}
                    >
                      {turmas.map(turma => (
                        <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                      ))}
                    </Picker>
                  ) : (
                    <Text style={[styles.pickerPlaceholder, { color: '#aaa' }]}>Nenhuma turma cadastrada</Text>
                  )}
                </View>
              </View>

              <View style={styles.formControl}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={styles.input}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="AAAA-MM-DD"
                  keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
                />
                {/* DICA: Implementar um DateTimePicker aqui para melhor UX */}
              </View>
            </View>

            {/* Botão temporário para adicionar dados de exemplo */}
           


            <View style={styles.boxAlunos}>
              {(!selectedTurmaId || !selectedDate) ? (
                <View style={styles.alertInfo}>
                  <Text style={styles.alertText}>Selecione uma turma e uma data para carregar a lista de alunos.</Text>
                </View>
              ) : alunosDaTurma.length === 0 ? (
                <View style={styles.alertWarning}>
                  <Text style={styles.alertText}>Esta turma não possui alunos cadastrados.</Text>
                </View>
              ) : (
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Aluno</Text>
                    <Text style={[styles.tableHeaderText, styles.rightAlignText]}>Presente</Text>
                  </View>
                  {alunosDaTurma.map(aluno => (
                    <View key={aluno.id} style={styles.tableRow}>
                      <Text style={styles.tableRowText}>{aluno.nome}</Text>
                      <View style={styles.checkboxCell}>
                        <Checkbox
                          onValueChange={() => handleTogglePresence(aluno.id)}
                          value={alunosPresentes[aluno.id] || false}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.buttonPrimary} onPress={salvarChamada}>
              <Text style={styles.buttonPrimaryText}>Salvar Chamada</Text>
            </TouchableOpacity>
          </View>

          {/* Coluna 2: Chamadas Recentes */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chamadas Recentes</Text>
            <View style={styles.listaChamadas}>
              {!selectedTurmaId ? (
                <View style={styles.alertInfo}>
                  <Text style={styles.alertText}>Selecione uma turma para ver o histórico de chamadas.</Text>
                </View>
              ) : chamadasRecentes.length === 0 ? (
                <View style={styles.alertWarning}>
                  <Text style={styles.alertText}>Nenhuma chamada registrada ainda para esta turma.</Text>
                </View>
              ) : (
                <View>
                  {chamadasRecentes.map((c, index) => (
                    <View key={`${c.dataISO}-${index}`} style={styles.chamadaItem}>
                      <Text style={styles.chamadaItemDate}>
                        <Text style={{ fontWeight: 'bold' }}>Data:</Text> {formatDate(c.dataISO)}
                      </Text>
                      <Text style={styles.chamadaItemPresenca}>
                        {Object.values(c.presencas || {}).filter(Boolean).length} presentes
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    minWidth: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formRow: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 20,
  },
  formControl: {},
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerPlaceholder: {
    height: 50,
    lineHeight: 50,
    paddingLeft: 10,
    color: '#aaa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 50,
    color: '#333',
  },
  boxAlunos: {
    marginTop: 20,
    marginBottom: 20,
  },
  alertInfo: {
    backgroundColor: '#e7f3ff',
    padding: 15,
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  alertWarning: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },
  alertText: {
    fontSize: 14,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  rightAlignText: {
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  tableRowText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  checkboxCell: {
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listaChamadas: {
    marginTop: 10,
  },
  chamadaItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chamadaItemDate: {
    fontSize: 15,
    color: '#333',
  },
  chamadaItemPresenca: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});