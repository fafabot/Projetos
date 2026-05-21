import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaHome() {
  const fazerLogout = () => {
    signOut(autenticacao);
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Home</Text>
      <Text style={estilos.welcome}>Bem-vindo, {autenticacao.currentUser?.email}</Text>
      <TouchableOpacity style={estilos.button} onPress={fazerLogout}>
        <Text style={estilos.buttonText}>Sair</Text>
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
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 22,
    color: '#0f2f70',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  welcome: {
    width: '50%',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 30,
    fontSize: 20,
    marginBottom: 32,
    color: '#2d3c68',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  button: {
    width: '50%',
    height: 55,
    backgroundColor: '#ff5b5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#ff5b5b',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});