// app/(tabs)/index.tsx
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importa o store.js
import { store } from '../../src/store';

export default function ReportScreen() {
  type Turma = { id: string; nome: string };
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [reportContent, setReportContent] = useState<React.ReactNode>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar as turmas
  const loadTurmas = useCallback(async () => {
    setRefreshing(true);
    setLoadingTurmas(true);
    try {
      const loadedTurmas = await store.listTurmas();
      setTurmas(loadedTurmas);

      if (loadedTurmas.length > 0) {
        if (
          !selectedTurmaId ||
          !loadedTurmas.some((t: { id: string; nome: string }) => t.id === selectedTurmaId)
        ) {
          setSelectedTurmaId(loadedTurmas[0].id);
        }
      } else {
        setSelectedTurmaId(null);
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as turmas.');
    } finally {
      setRefreshing(false);
      setLoadingTurmas(false);
    }
  }, [selectedTurmaId]);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  // Componente para renderizar a tabela de relatório
  type ReportData = {
    itens: {
      aluno: { id: string; nome: string };
      presencas: number;
      totalAulas: number;
      perc: number;
    }[];
    totalAulas: number;
  };

  const ReportTable = ({ data }: { data: ReportData }) => {
    if (!data || !data.itens || data.itens.length === 0) {
      return <Text style={styles.warningAlert}>Nenhum aluno encontrado ou chamadas para esta turma.</Text>;
    }
    return (
      <ScrollView horizontal style={styles.tableScrollView}>
        <View style={styles.table}>
          {/* Cabeçalho da Tabela */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 3 }]}>Aluno</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Presenças</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Faltas</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Total Aulas</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>% Presença</Text>
          </View>

          {/* Linhas de Dados */}
          {data.itens.map((item) => (
            <View key={item.aluno.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{String(item.aluno.nome)}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{String(item.presencas)}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{String(item.totalAulas - item.presencas)}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{String(item.totalAulas)}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{`${String(item.perc)}%`}</Text>
            </View>
          ))}

          {/* Rodapé da Tabela */}
          <View style={styles.tableFooter}>
            <Text style={[styles.footerCell, { flex: 3 }]}>Total de aulas da turma:</Text>
            <Text style={[styles.footerCell, { flex: 1 }]}>{String(data.totalAulas)}</Text>
            <Text style={[styles.footerCell, { flex: 1 }]}></Text>
            <Text style={[styles.footerCell, { flex: 1 }]}></Text>
            <Text style={[styles.footerCell, { flex: 1 }]}></Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const handleGerarRelatorio = async () => {
    if (!selectedTurmaId) {
      setReportContent(<Text style={styles.infoAlert}>Selecione uma turma.</Text>);
      return;
    }

    setReportContent(<ActivityIndicator size="large" color="#0000ff" />);
    try {
      const rel = await store.relatorioTurma(selectedTurmaId);
      if (rel.totalAulas === 0) {
        setReportContent(<Text style={styles.warningAlert}>Ainda não há chamadas registradas para esta turma.</Text>);
      } else {
        setReportContent(<ReportTable data={rel} />);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
      setReportContent(null);
    }
  };

  if (loadingTurmas) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Carregando turmas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTurmas} />}
      >
        <Text style={styles.title}>Relatórios de Frequência</Text>

        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Turma</Text>
            {turmas.length === 0 ? (
              <Text style={styles.pickerDisabled}>Nenhuma turma cadastrada</Text>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTurmaId}
                  onValueChange={(itemValue) => setSelectedTurmaId(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {turmas.map((turma) => (
                    <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Gerar"
              onPress={handleGerarRelatorio}
              color="#007bff"
              disabled={turmas.length === 0 || !selectedTurmaId}
            />
          </View>
        </View>

        <View style={styles.reportBox}>{reportContent}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
  },
  cardContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  formGroup: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 80,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  pickerDisabled: {
    borderColor: '#e9ecef',
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#6c757d',
    fontSize: 16,
    height: 40,
    textAlignVertical: 'auto',
  },
  buttonContainer: {},
  reportBox: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center', // mantém centralização para loaders/avisos
    justifyContent: 'center',
    width: '100%',
  },
  infoAlert: {
    color: '#0c5460',
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%',
  },
  warningAlert: {
    color: '#856404',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%',
  },
  tableScrollView: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    minWidth: 400,
    alignSelf: 'stretch',
    writingDirection: 'ltr',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'flex-start',
  },
  headerCell: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
    fontSize: 14,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'flex-start',
  },
  tableCell: {
    paddingHorizontal: 5,
    fontSize: 14,
    textAlign: 'left',
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'flex-start',
  },
  footerCell: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
    fontSize: 14,
    textAlign: 'left',
  },
});