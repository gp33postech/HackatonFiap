// App.js
import { Picker } from '@react-native-picker/picker'; // Importar o Picker
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Importa o store.js que acabamos de adaptar
import { store } from './src/store';

export default function App() {
  // Estados para gerenciar as turmas e a turma selecionada
  const [turmas, setTurmas] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState(null);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [reportContent, setReportContent] = useState(null); // Para o conteúdo do relatório

  // Efeito para carregar as turmas quando o componente é montado
  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedTurmas = await store.listTurmas();
        setTurmas(loadedTurmas);
        if (loadedTurmas.length > 0) {
          setSelectedTurmaId(loadedTurmas[0].id); // Seleciona a primeira turma por padrão
        }
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        Alert.alert("Erro", "Não foi possível carregar as turmas.");
      } finally {
        setLoadingTurmas(false);
      }
    }
    loadInitialData();
  }, []); // Array vazio significa que executa apenas uma vez ao montar

  // Função para gerar o relatório (será implementada depois)
  const handleGerarRelatorio = async () => {
    if (!selectedTurmaId) {
      setReportContent(<Text style={styles.infoAlert}>Selecione uma turma.</Text>);
      return;
    }

    // Simulação: Apenas para testar se o botão funciona
    // Na próxima etapa, aqui chamaremos store.relatorioTurma
    setReportContent(<ActivityIndicator size="large" color="#0000ff" />);
    try {
        const rel = await store.relatorioTurma(selectedTurmaId);
        if (rel.totalAulas === 0) {
            setReportContent(<Text style={styles.warningAlert}>Ainda não há chamadas registradas para esta turma.</Text>);
        } else {
            // Aqui vamos renderizar a tabela na próxima etapa
            setReportContent(<Text>Relatório gerado para a turma: {turmas.find(t => t.id === selectedTurmaId)?.nome}</Text>);
        }
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        Alert.alert("Erro", "Não foi possível gerar o relatório.");
        setReportContent(null);
    }
  };


  // Componente de carregamento para a seleção de turmas
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
      <View style={styles.card}>
        <Text style={styles.title}>Relatórios</Text>

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
              color="#007bff" // Cor primária do seu btn-primary
              disabled={turmas.length === 0}
            />
          </View>
        </View>

        {/* Div para o relatório */}
        <View style={styles.reportBox}>
            {reportContent}
        </View>

      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Alinha os itens pela base
    marginBottom: 16,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  formGroup: {
    flex: 1, // Permite que o grupo do picker ocupe espaço
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
    // Overflow hidden para garantir que o Picker não vaze bordas arredondadas no iOS
    overflow: 'hidden',
    height: 40, // Altura fixa para o picker
    justifyContent: 'center',
  },
  picker: {
    height: 40, // A altura deve ser a mesma do pickerContainer
    width: '100%',
  },
  pickerItem: {
    // Estilos para os itens do picker (pode não ter efeito total em todas as plataformas)
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
    textAlignVertical: 'center',
  },
  buttonContainer: {
    // Estilos para o botão, se necessário
    // Por exemplo, para ajustar largura ou alinhamento
  },
  reportBox: {
    marginTop: 20,
    flex: 1, // Permite que o box ocupe o restante do espaço
    alignItems: 'center', // Para centralizar as mensagens iniciais
    justifyContent: 'center',
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
  }
});