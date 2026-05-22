import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { autenticacao } from '../config/firebaseConfig';

export default function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const fazerCadastro = async () => {
    try {
      await createUserWithEmailAndPassword(
        autenticacao,
        email,
        senha
      );

      navigation.navigate('Login');
    } catch (erro) {
      console.log(erro);
      setErro('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={estilos.safeArea}>
      <KeyboardAvoidingView
        style={estilos.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#070707"
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.backgroundShapeTop} />
          <View style={estilos.backgroundShapeBottom} />

          <View style={estilos.content}>
            <View style={estilos.logoArea}>
              <View style={estilos.iconWrapper}>
                <Image
                  source={require('../assets/logo.png')}
                  style={estilos.logo}
                />
              </View>

              <Text style={estilos.title}>
                KEY FORGE
              </Text>

              <Text style={estilos.subtitle}>
                CRIE SUA CONTA
              </Text>
            </View>

            <View style={estilos.form}>
              <Text style={estilos.label}>
                Nome
              </Text>

              <TextInput
                style={estilos.input}
                placeholder="Seu nome"
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={nome}
                onChangeText={setNome}
              />

              <Text style={estilos.label}>
                E-mail
              </Text>

              <TextInput
                style={estilos.input}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={estilos.label}>
                Senha
              </Text>

              <TextInput
                style={estilos.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              {erro ? (
                <Text style={estilos.erro}>
                  {erro}
                </Text>
              ) : null}

              <TouchableOpacity
                style={estilos.button}
                onPress={fazerCadastro}
              >
                <Text style={estilos.buttonText}>
                  Cadastrar
                </Text>
              </TouchableOpacity>

              <View style={estilos.loginRow}>
                <Text style={estilos.loginText}>
                  Já possui uma conta?
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Login')
                  }
                >
                  <Text style={estilos.loginLink}>
                    {' '}Faça login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },

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
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 20
        : 20,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },

  iconWrapper: {
    marginBottom: 10,
  },

  logo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
  },

  title: {
    color: '#ECECEC',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },

  subtitle: {
    color: '#BEBFC4',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#E5E5E5',
    marginBottom: 8,
    fontSize: 14,
  },

  input: {
    backgroundColor: '#121212',
    color: '#ECECEC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },

  button: {
    backgroundColor: '#A5151D',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#8B8B8B',
    fontSize: 14,
  },

  loginLink: {
    color: '#ECECEC',
    fontSize: 14,
    fontWeight: '700',
  },

  erro: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 10,
  },
});