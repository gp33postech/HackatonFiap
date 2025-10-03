import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {ActivityIndicator,Alert,StyleSheet,Text,TextInput,TouchableOpacity,View,KeyboardAvoidingView,Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../src/config/firebase'; // Verifique se o caminho está correto
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Atenção", "Por favor, preencha o usuário e a senha.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(app)');
    } catch (error) {
      if (error instanceof FirebaseError) {
        Alert.alert("Erro de Login", "Usuário ou senha inválidos.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {/* Label e Input para Usuário */}
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Label e Input para Senha */}
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Container para alinhar o botão à direita */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ESTILOS ATUALIZADOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'left', 
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    height: 44,
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
   
    alignItems: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#000', 
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});