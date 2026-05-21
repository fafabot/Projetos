import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const fazerLogin = async () => {
    try {
      await signInWithEmailAndPassword(autenticacao, email, senha);
      navigation.navigate('Home');
    } catch (erro) {
      setErro('Erro ao fazer login. Verifique seus dados.');
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Login</Text>
      <TextInput
        style={estilos.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={estilos.button} onPress={fazerLogin}>
        <Text style={estilos.buttonText}>Entrar</Text>
      </TouchableOpacity>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      <TouchableOpacity style={estilos.linkButton} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={estilos.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f1ff',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#0f2f70',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  input: {
    width: '50%',
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d9e4ff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  button: {
    width: '50%',
    height: 55,
    backgroundColor: '#3d7bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: '#3d7bff',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  erro: {
    color: '#d32f2f',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  linkButton: {
    width: '50%',
    height: 55,
    backgroundColor: '#2bbd7e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
    shadowColor: '#2bbd7e',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});