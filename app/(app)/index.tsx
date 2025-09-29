// app/(app)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {ScrollView,StatusBar,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, subtitle, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.menuItem, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={40} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );
};

// Componente para visualização em grid (3 por linha)
const GridMenuItem: React.FC<MenuItemProps> = ({ title, subtitle, icon, color, onPress }) => {
  // Determina o tamanho da fonte baseado no comprimento do texto
  const getFontSize = (text: string) => {
    if (text.length <= 7) return 14;      // Textos curtos como "Notas", "Turmas", "Chamada"
    if (text.length <= 9) return 12;      // Textos médios como "Agenda"
    return 10;                            // Textos muito longos
  };

  return (
    <TouchableOpacity style={[styles.gridItem, { borderColor: color }]} onPress={onPress}>
      <View style={[styles.gridIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={32} color="#FFF" />
      </View>
      <Text 
        style={[styles.gridTitle, { fontSize: getFontSize(title) }]}
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.7}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default function MenuPrincipal() {
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(true);

  const menuItems = [
    {
      title: 'Turmas',
      subtitle: 'Gerenciar turmas e classes',
      icon: 'school-outline' as keyof typeof Ionicons.glyphMap,
      color: '#4A90E2',
      route: '/turmas'
    },
    {
      title: 'Alunos',
      subtitle: 'Cadastro e gerenciamento de alunos',
      icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
      color: '#50C878',
      route: '/alunos'
    },
    {
      title: 'Chamada',
      subtitle: 'Realizar chamada e controle de presença',
      icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
      color: '#FF6B6B',
      route: '/chamada'
    },
    {
      title: 'Notas',
      subtitle: 'Gerenciar notas e avaliações',
      icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
      color: '#9B59B6',
      route: '/notas'
    },
    {
      title: 'Agenda',
      subtitle: 'Calendário e eventos',
      icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
      color: '#E67E22',
      route: '/agenda'
    },
    {
      title: 'Avisos',
      subtitle: 'Mensagens e comunicados',
      icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
      color: '#3498DB',
      route: '/avisos'
    }
  ];

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E3A59" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="school" size={32} color="#FFF" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Sistema Escolar</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
            <Ionicons 
              name={isGridView ? "list" : "grid"} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ScrollView para permitir rolagem */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu Principal</Text>
          
          {isGridView ? (
            // Visualização em Grid (3 por linha)
            <View style={styles.gridContainer}>
              {menuItems.map((item, index) => (
                <GridMenuItem
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  color={item.color}
                  onPress={() => router.push(item.route as any)}
                />
              ))}
            </View>
          ) : (
            // Visualização em Lista (padrão)
            <>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  color={item.color}
                  onPress={() => router.push(item.route as any)}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hackaton FIAP</Text>
        <Text style={styles.footerVersion}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#2E3A59',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B8C5D6',
    marginLeft: 44,
  },
  menuContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 25,
    marginLeft: 5,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 2,
   
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: '#999',
  },
  // Novos estilos para header alternativo
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  // Estilos para visualização em grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  gridIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 5,
    textAlign: 'center',
    lineHeight: 16,
    flexShrink: 1,
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});