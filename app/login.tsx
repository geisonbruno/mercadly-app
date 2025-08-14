import { auth } from "@/config/firebase";
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/list');
    } catch (error: any) {
      Alert.alert('Erro ao entrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>🥕</Text>

      {/* Título */}
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your emails and password</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Senha */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />

      {/* Esqueci senha */}
      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Link para cadastro */}
      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text style={styles.linkText} onPress={() => router.replace('/register')}>
          Signup
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 48,
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  linkText: {
    color: '#2E8B57',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2E8B57',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
});
