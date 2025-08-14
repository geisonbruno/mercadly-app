import { auth } from "@/config/firebase";
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      router.replace('/list');
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>🥕</Text>

      {/* Título */}
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>

      {/* Nome */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Senha */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Política */}
      <Text style={styles.policyText}>
        By continuing you agree to our{' '}
        <Text style={styles.linkText}>Terms of Service</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Link para login */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => router.replace('/login')}>
          Login
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
  policyText: {
    fontSize: 12,
    color: '#777',
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
