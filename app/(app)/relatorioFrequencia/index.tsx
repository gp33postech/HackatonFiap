// app/(tabs)/relatorios.tsx

import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { store, Turma, Relatorio } from '../../../src/services/store';

export default function RelatoriosScreen() {
  // Estados para a lista de turmas e a turma selecionada no Picker
  const [turmasList, setTurmasList] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | number | null>(null);

  // Estado para guardar os dados do relatório gerado
  const [reportData, setReportData] = useState<Relatorio | null>(null);
  
  
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    async function loadTurmas() {
      try {
        const loadedTurmas = await store.listTurmas();
        setTurmasList(loadedTurmas);
        // Se houver turmas, seleciona a primeira por padrão
        if (loadedTurmas.length > 0) {
          setSelectedTurmaId(loadedTurmas[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a lista de turmas.');
      }
    }
    loadTurmas();
  }, []);

  // Função chamada ao clicar no botão "Gerar Relatório"
  const handleGenerateReport = async () => {
    if (!selectedTurmaId) {
      Alert.alert('Atenção', 'Por favor, selecione uma turma.');
      return;
    }

    setIsLoading(true);
    setReportData(null); // Limpa o relatório anterior

    try {
      const report = await store.relatorioTurma(selectedTurmaId);
      setReportData(report);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para renderizar tabela do relatório
  const renderReportItem = ({ item }: { item: Relatorio['itens'][0] }) => {
    
    const faltas = item.totalAulas - item.presencas;

    const pegarPorcentagemCor = (porcentagem: number): string => {
    if (porcentagem > 70) {
      return 'green';
    }
    if (porcentagem >= 50) { 
      return 'orange';
    }
    return 'red'; 
};

    const porcentagemCor = pegarPorcentagemCor(item.perc);


    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 3 }]}>{item.aluno.nome}</Text>
        <Text style={[styles.tableCell, { flex: 1, color: 'green' }]}>{item.presencas}</Text>
        <Text style={[styles.tableCell, { flex: 1, color: 'red' }]}>{faltas}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{item.totalAulas}</Text>
        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold', color: porcentagemCor }]}>{`${item.perc}%`}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Card do formulário para gerar o relatório */}
      <View style={styles.card}>
        <Text style={styles.label}>Selecione a Turma</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTurmaId ?? undefined}
            onValueChange={(itemValue) => setSelectedTurmaId(itemValue)}
          >
            {turmasList.map((turma) => (
              <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
            ))}
          </Picker>
        </View>
        <Button title="Gerar Relatório" onPress={handleGenerateReport} disabled={isLoading} />
      </View>

      {/* Seção do Relatório */}
      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      
      {reportData && (
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.title}>Relatório de Presença</Text>
          {reportData.itens.length === 0 ? (
             <Text style={styles.infoText}>Nenhum aluno ou chamada encontrada para esta turma.</Text>
          ) : (
            <View style={styles.table}>
              {/* Cabeçalho da Tabela */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 3 }]}>Aluno</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Presenças</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Faltas</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Aulas</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>%</Text>
              </View>
              {/* Corpo da Tabela */}
              <FlatList
                data={reportData.itens}
                renderItem={renderReportItem}
                keyExtractor={(item) => item.aluno.id}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    paddingVertical: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
  },
});