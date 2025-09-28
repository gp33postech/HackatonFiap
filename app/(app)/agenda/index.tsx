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

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: 'aula' | 'prova' | 'reuniao' | 'evento';
  local?: string;
}

export default function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState('2024-09-28');
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Aula de Matemática',
      descricao: 'Álgebra Linear - Sistemas de Equações',
      data: '2024-09-28',
      hora: '08:00',
      tipo: 'aula',
      local: 'Sala 101'
    },
    {
      id: '2',
      titulo: 'Prova de História',
      descricao: 'Avaliação sobre Segunda Guerra Mundial',
      data: '2024-09-28',
      hora: '10:30',
      tipo: 'prova',
      local: 'Sala 205'
    },
    {
      id: '3',
      titulo: 'Reunião de Pais',
      descricao: 'Reunião mensal com responsáveis',
      data: '2024-09-28',
      hora: '19:00',
      tipo: 'reuniao',
      local: 'Auditório'
    }
  ]);

  const handleAddEvento = () => {
    console.log('Adicionar evento');
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'aula': return 'book-outline';
      case 'prova': return 'document-text-outline';
      case 'reuniao': return 'people-outline';
      case 'evento': return 'calendar-outline';
      default: return 'calendar-outline';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'aula': return 'Aula';
      case 'prova': return 'Prova';
      case 'reuniao': return 'Reunião';
      case 'evento': return 'Evento';
      default: return 'Evento';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const eventosHoje = eventos.filter(evento => evento.data === selectedDate);

  const renderEvento = (evento: Evento) => (
    <View key={evento.id} style={styles.eventoCard}>
      <View style={styles.eventoHeader}>
        <View style={styles.eventoTipo}>
          <Ionicons 
            name={getTipoIcon(evento.tipo) as any} 
            size={16} 
            color="#E67E22" 
          />
          <Text style={styles.tipoLabel}>
            {getTipoLabel(evento.tipo)}
          </Text>
        </View>
        <Text style={styles.eventoHora}>{evento.hora}</Text>
      </View>
      
      <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
      <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
      
      {evento.local && (
        <View style={styles.localContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.eventoLocal}>{evento.local}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Agenda</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color="#E67E22" />
            <Text style={styles.cardTitle}>Data Atual</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAddEvento}>
            <Ionicons name="add-circle-outline" size={20} color="#E67E22" />
            <Text style={styles.actionText}>Adicionar Evento</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Eventos de Hoje ({eventosHoje.length})</Text>
          {eventosHoje.length > 0 ? (
            eventosHoje.map(renderEvento)
          ) : (
            <Text style={styles.emptyText}>Nenhum evento para hoje</Text>
          )}
        </View>
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
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textTransform: 'capitalize',
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
    color: '#E67E22',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  eventoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E67E22',
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoLabel: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  eventoHora: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  eventoDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  localContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventoLocal: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});