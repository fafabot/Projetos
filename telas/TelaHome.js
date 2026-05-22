import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

const tecnologias = [
  {
    id: '1',
    nome: 'React Native',
    descricao: 'Framework para criar apps nativos',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/reactnative-original.png',
  },
  {
    id: '2',
    nome: 'JavaScript',
    descricao: 'Linguagem da web',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/javascript-original.png',
  },
  {
    id: '3',
    nome: 'TypeScript',
    descricao: 'JavaScript com tipagem',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/typescript-original.png',
  },
  {
    id: '4',
    nome: 'Node.js',
    descricao: 'Back-end com JavaScript',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/nodejs-original.png',
  },
  {
    id: '5',
    nome: 'SQL',
    descricao: 'Banco de dados relacional',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/html5-original.png',
  },
  {
    id: '6',
    nome: 'Firebase',
    descricao: 'Backend e autenticação',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/firebase-original.png',
  },
  {
    id: '7',
    nome: 'Python',
    descricao: 'Data Science e IA',
    imagem:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/250px-Python-logo-notext.svg.png',
  },
  {
    id: '8',
    nome: 'CSS',
    descricao: 'Estilização e layout',
    imagem:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/960px-CSS3_logo_and_wordmark.svg.png',
  },
  {
    id: '9',
    nome: 'HTML',
    descricao: 'Estrutura da web',
    imagem:
      'https://washington.pro.br/wp-content/uploads/2026/02/html5-original.png',
  },
  {
    id: '10',
    nome: 'Docker',
    descricao: 'Ambientes isolados',
    imagem:
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Docker_Logo.png',
  },
  {
    id: '11',
    nome: 'Git',
    descricao: 'Controle de versão',
    imagem:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/1280px-Git-logo.svg.png',
  },
];

export default function TelaHome() {
  const fazerLogout = () => {
    signOut(autenticacao);
  };

  const renderItem = ({ item }) => (
    <View style={estilos.card}>
      <View style={estilos.cardLeft}>
        <Image
          source={{ uri: item.imagem }}
          style={estilos.logo}
          resizeMode="contain"
        />

        <View style={estilos.info}>
          <Text style={estilos.nome}>
            {item.nome}
          </Text>

          <Text style={estilos.descricao}>
            {item.descricao}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={estilos.botaoInstalar}>
        <Text style={estilos.textoBotao}>
          Instalar
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#070707"
      />

      <View style={estilos.container}>
        <View style={estilos.backgroundShapeTop} />
        <View style={estilos.backgroundShapeBottom} />

        <ScrollView
          style={estilos.scroll}
          contentContainerStyle={estilos.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <View style={estilos.content}>
            <View style={estilos.header}>
              <Image
                source={require('../assets/logo.png')}
                style={estilos.logoPrincipal}
              />

              <Text style={estilos.title}>
                KEY FORGE
              </Text>

              <Text style={estilos.subtitle}>
                SUA BIBLIOTECA DE TECNOLOGIAS
              </Text>
            </View>

            <View style={estilos.userBox}>
              <Text style={estilos.userLabel}>
                LOGADO COMO
              </Text>

              <Text style={estilos.userEmail}>
                {autenticacao.currentUser?.email}
              </Text>
            </View>

            <TouchableOpacity
              style={estilos.button}
              onPress={fazerLogout}
            >
              <Text style={estilos.buttonText}>
                Sair da Conta
              </Text>
            </TouchableOpacity>

            <Text style={estilos.sectionTitle}>
              Tecnologias
            </Text>

            <FlatList
              data={tecnologias}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingBottom: 120,
              }}
            />
          </View>
        </ScrollView>
      </View>
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
    width: '100%',
    backgroundColor: '#070707',
    overflow: 'hidden',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#070707',
  },

  scrollContent: {
    flexGrow: 1,
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
    width: '100%',
    backgroundColor: '#070707',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 20
        : 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoPrincipal: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 10,
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

  userBox: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginBottom: 18,
  },

  userLabel: {
    color: '#8B8B8B',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  userEmail: {
    color: '#ECECEC',
    fontSize: 16,
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#A5151D',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#ECECEC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 48,
    height: 48,
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  nome: {
    color: '#ECECEC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  descricao: {
    color: '#8B8B8B',
    fontSize: 13,
  },

  botaoInstalar: {
    backgroundColor: '#A5151D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginLeft: 10,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});