import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaCadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const fazerCadastro = async () => {
    try {
      await createUserWithEmailAndPassword(autenticacao, email, senha);
      navigation.navigate('Login');
    } catch (erro) {
      setErro('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={estilos.backgroundShapeTop} />
      <View style={estilos.backgroundShapeBottom} />

      <View style={estilos.content}>
        <View style={estilos.logoArea}>
          <View style={estilos.iconWrapper}>
            <View style={estilos.iconCircle}>
              <View style={estilos.crossHorizontal} />
              <View style={estilos.crossVertical} />
              <View style={estilos.iconInnerCircle} />
            </View>
            <View style={estilos.keyStem}>
              <View style={estilos.keyTooth} />
              <View style={estilos.keyTooth} />
            </View>
          </View>

          <Text style={estilos.title}>KEY FORGE</Text>
          <Text style={estilos.subtitle}>SUA CHAVE PARA GRANDES JOGOS</Text>
        </View>

        <View style={estilos.form}>
          <Text style={estilos.label}>E-mail</Text>
          <TextInput
            style={estilos.input}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={estilos.label}>Senha</Text>
          <TextInput
            style={estilos.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

          <TouchableOpacity style={estilos.button} onPress={fazerCadastro}>
            <Text style={estilos.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <View style={estilos.loginRow}>
            <Text style={estilos.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={estilos.loginLink}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  backgroundShapeTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#7B121B',
    top: -120,
    right: -100,
    opacity: 0.9,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#2C0A0F',
    bottom: -150,
    left: -120,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 236, 236, 0.08)',
  },
  crossHorizontal: {
    position: 'absolute',
    width: 38,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ECECEC',
  },
  crossVertical: {
    position: 'absolute',
    width: 6,
    height: 38,
    borderRadius: 3,
    backgroundColor: '#ECECEC',
  },
  iconInnerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#070707',
  },
  keyStem: {
    marginTop: -14,
    width: 16,
    height: 64,
    backgroundColor: '#ECECEC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  keyTooth: {
    width: 10,
    height: 10,
    backgroundColor: '#070707',
    marginTop: 8,
    borderRadius: 2,
  },
  title: {
    color: '#ECECEC',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    color: '#BEBFC4',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  form: {
    width: '100%',
  },
  label: {
    color: '#BABABA',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#121212',
    color: '#ECECEC',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 22,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  button: {
    backgroundColor: '#9C131B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: '#F9F9F9',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginText: {
    color: '#777',
    fontSize: 14,
  },
  loginLink: {
    color: '#ECECEC',
    fontSize: 14,
    fontWeight: '700',
  },
  erro: {
    color: '#F15A5A',
    marginBottom: 10,
    textAlign: 'center',
  },
});
