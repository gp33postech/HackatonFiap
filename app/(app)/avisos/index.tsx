import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  tipo: 'urgente' | 'importante' | 'informativo';
  autor: string;
  lido: boolean;
}

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([
    {
      id: '1',
      titulo: 'Suspensão das aulas - Feriado Nacional',
      conteudo: 'Informamos que as aulas do dia 07/09 (Independência do Brasil) estão suspensas. As atividades retornam normalmente no dia 08/09.',
      data: '2024-09-05',
      tipo: 'importante',
      autor: 'Direção',
      lido: false
    },
    {
      id: '2',
      titulo: 'URGENTE: Mudança de horário - Reunião de Pais',
      conteudo: 'A reunião de pais marcada para hoje (28/09) foi alterada das 19h para 20h devido a questões técnicas. Pedimos desculpas pelo transtorno.',
      data: '2024-09-28',
      tipo: 'urgente',
      autor: 'Coordenação',
      lido: false
    },
    {
      id: '3',
      titulo: 'Feira de Ciências 2024',
      conteudo: 'Estão abertas as inscrições para a Feira de Ciências 2024. Os projetos devem ser entregues até o dia 15/10. Mais informações na secretaria.',
      data: '2024-09-25',
      tipo: 'informativo',
      autor: 'Secretaria Acadêmica',
      lido: true
    },
    {
      id: '4',
      titulo: 'Cardápio da semana - Cantina Escolar',
      conteudo: 'Confira o cardápio desta semana: Segunda - Lasanha; Terça - Frango grelhado; Quarta - Peixe assado; Quinta - Hambúrguer caseiro; Sexta - Pizza.',
      data: '2024-09-23',
      tipo: 'informativo',
      autor: 'Cantina',
      lido: true
    },
    {
      id: '5',
      titulo: 'Atualização do sistema acadêmico',
      conteudo: 'O sistema acadêmico passará por manutenção no domingo (29/09) das 08h às 14h. Durante este período, o acesso poderá ficar indisponível.',
      data: '2024-09-26',
      tipo: 'importante',
      autor: 'TI',
      lido: false
    },
  ]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'alert-circle';
      case 'importante': return 'warning';
      case 'informativo': return 'information-circle';
      default: return 'document-text';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return '#FF3B30';
      case 'importante': return '#FF9500';
      case 'informativo': return '#007AFF';
      default: return '#666';
    }
  };

  const getTipoBgColor = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'rgba(255, 59, 48, 0.1)';
      case 'importante': return 'rgba(255, 149, 0, 0.1)';
      case 'informativo': return 'rgba(0, 122, 255, 0.1)';
      default: return 'rgba(102, 102, 102, 0.1)';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'URGENTE';
      case 'importante': return 'IMPORTANTE';
      case 'informativo': return 'INFORMATIVO';
      default: return 'AVISO';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleMarcarLido = (id: string) => {
    setAvisos(prev => prev.map(aviso => 
      aviso.id === id ? { ...aviso, lido: !aviso.lido } : aviso
    ));
  };

  const handleAddAviso = () => {
    console.log('Adicionar aviso');
  };

  const avisosNaoLidos = avisos.filter(aviso => !aviso.lido);
  const avisosLidos = avisos.filter(aviso => aviso.lido);

  const renderAviso = (aviso: Aviso) => (
    <View key={aviso.id} style={[
      styles.avisoCard,
      !aviso.lido && styles.avisoNaoLido
    ]}>
      <View style={styles.avisoHeader}>
        <View style={[styles.tipoBadge, { backgroundColor: getTipoBgColor(aviso.tipo) }]}>
          <Ionicons 
            name={getTipoIcon(aviso.tipo) as any} 
            size={16} 
            color={getTipoColor(aviso.tipo)} 
          />
          <Text style={[styles.tipoText, { color: getTipoColor(aviso.tipo) }]}>
            {getTipoLabel(aviso.tipo)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.leidoButton}
          onPress={() => handleMarcarLido(aviso.id)}
        >
          <Ionicons 
            name={aviso.lido ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={aviso.lido ? "#50C878" : "#CCC"} 
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.avisoTitulo, !aviso.lido && styles.textoNaoLido]}>
        {aviso.titulo}
      </Text>
      
      <Text style={styles.avisoConteudo}>
        {aviso.conteudo}
      </Text>

      <View style={styles.avisoFooter}>
        <View style={styles.autorContainer}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.autor}>{aviso.autor}</Text>
        </View>
        
        <View style={styles.dataContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.data}>{formatDate(aviso.data)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Avisos</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications-outline" size={20} color="#3498DB" />
            <Text style={styles.cardTitle}>Lista de Avisos</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAddAviso}>
            <Ionicons name="add-circle-outline" size={20} color="#3498DB" />
            <Text style={styles.actionText}>Adicionar Aviso</Text>
          </TouchableOpacity>
        </View>

        {avisosNaoLidos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Não Lidos ({avisosNaoLidos.length})</Text>
            {avisosNaoLidos.map(renderAviso)}
          </View>
        )}

        {avisosLidos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Lidos ({avisosLidos.length})</Text>
            {avisosLidos.map(renderAviso)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#3498DB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  avisoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498DB',
  },
  avisoNaoLido: {
    backgroundColor: '#fff3cd',
  },
  avisoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  leidoButton: {
    padding: 4,
  },
  avisoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  textoNaoLido: {
    fontWeight: 'bold',
  },
  avisoConteudo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  autorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autor: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  data: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
});