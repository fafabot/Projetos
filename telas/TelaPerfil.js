// === IMPORTS ===
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    autenticacao,
    bancoDados,
} from '../config/firebaseConfig';

// === CONSTANTES ===
const CAMPOS_INICIAIS = {
  nome: '',
  sobrenome: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  telefone: '',
};

// === COMPONENTE ===
export default function TelaPerfil() {
  // Estado
  const [perfil, setPerfil] = useState(CAMPOS_INICIAIS);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const usuario = autenticacao.currentUser;

  // Efeitos
  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario) {
        console.log('Usuário não autenticado'); // DEBUG
        setCarregando(false);
        return;
      }

      console.log('Carregando dados do perfil para UID:', usuario.uid); // DEBUG
      const storageKey = `@perfil_usuario_${usuario.uid}`;

      // 1. Ler dados do AsyncStorage para exibição instantânea
      try {
        const perfilLocal = await AsyncStorage.getItem(storageKey);
        if (perfilLocal) {
          console.log('Dados locais encontrados'); // DEBUG
          const dadosLocais = JSON.parse(perfilLocal);
          setPerfil({
            nome: dadosLocais.nome || '',
            sobrenome: dadosLocais.sobrenome || '',
            rua: dadosLocais.rua || '',
            bairro: dadosLocais.bairro || '',
            cidade: dadosLocais.cidade || '',
            estado: dadosLocais.estado || '',
            cep: dadosLocais.cep || '',
            telefone: dadosLocais.telefone || '',
          });
          setPhotoUrl(dadosLocais.fotoUrl || null);
          setEditando(false);
          setCarregando(false);
        }
      } catch (erro) {
        console.error('Erro ao carregar dados locais do perfil:', erro);
      }

      // 2. Buscar dados do Firestore em segundo plano
      try {
        console.log('Buscando dados no Firestore...'); // DEBUG
        const perfilRef = doc(bancoDados, 'users', usuario.uid);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
          console.log('Documento encontrado no Firestore:', perfilSnap.data()); // DEBUG
          const dados = perfilSnap.data();
          const novosDados = {
            nome: dados.nome || '',
            sobrenome: dados.sobrenome || '',
            rua: dados.rua || '',
            bairro: dados.bairro || '',
            cidade: dados.cidade || '',
            estado: dados.estado || '',
            cep: dados.cep || '',
            telefone: dados.telefone || '',
            fotoBase64: dados.fotoBase64 || null,
          };

          setPerfil({
            nome: novosDados.nome,
            sobrenome: novosDados.sobrenome,
            rua: novosDados.rua,
            bairro: novosDados.bairro,
            cidade: novosDados.cidade,
            estado: novosDados.estado,
            cep: novosDados.cep,
            telefone: novosDados.telefone,
          });
          setPhotoUrl(novosDados.fotoBase64);
          setEditando(false);

          // Atualizar cache local
          await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
        } else {
          console.log('Documento não encontrado no Firestore, criando dados padrão'); // DEBUG
          // Criar dados padrão se não existem
          const [primeiroNome, ...rest] = (usuario.displayName || '').split(' ');
          const dadosPadrao = {
            nome: primeiroNome || '',
            sobrenome: rest.join(' ') || '',
            rua: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
            telefone: '',
            fotoBase64: null,
          };

          setPerfil({
            nome: dadosPadrao.nome,
            sobrenome: dadosPadrao.sobrenome,
            rua: dadosPadrao.rua,
            bairro: dadosPadrao.bairro,
            cidade: dadosPadrao.cidade,
            estado: dadosPadrao.estado,
            cep: dadosPadrao.cep,
            telefone: dadosPadrao.telefone,
          });
          setPhotoUrl(dadosPadrao.fotoBase64);
          setEditando(true);

          // Salvar dados padrão no cache
          const dadosPadraoComBase64 = {
            nome: dadosPadrao.nome,
            sobrenome: dadosPadrao.sobrenome,
            rua: dadosPadrao.rua,
            bairro: dadosPadrao.bairro,
            cidade: dadosPadrao.cidade,
            estado: dadosPadrao.estado,
            cep: dadosPadrao.cep,
            telefone: dadosPadrao.telefone,
            fotoBase64: null,
          };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dadosPadraoComBase64));
        }
      } catch (erro) {
        console.error('Erro ao buscar dados do Firestore:', {
          message: erro.message,
          code: erro.code,
          stack: erro.stack,
        }); // DEBUG
        const perfilLocal = await AsyncStorage.getItem(storageKey);
        if (!perfilLocal) {
          Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        }
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuario]);

  // Funções
  const selecionarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à galeria para escolher a foto de perfil.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Corrigido: usar array em vez de MediaTypeOptions
      allowsEditing: true,
      aspect: [1, 1], // Quadrado para perfil
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      setLocalImage(resultado.assets[0].uri);
    } else if (!resultado.cancelled && resultado.uri) {
      setLocalImage(resultado.uri);
    }
  };

  const convertToBase64 = async (uri) => {
    try {
      console.log('Convertendo imagem para Base64:', uri); // DEBUG
      
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Erro ao ler arquivo: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob criado, tamanho:', blob.size); // DEBUG
      
      // Converter blob para Base64
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result;
          console.log('Conversão para Base64 concluída'); // DEBUG
          resolve(base64);
        };
        reader.onerror = (erro) => {
          console.error('Erro ao ler arquivo:', erro); // DEBUG
          reject(erro);
        };
        reader.readAsDataURL(blob);
      });
    } catch (erro) {
      console.error('Erro na conversão para Base64:', {
        message: erro.message,
        stack: erro.stack,
      }); // DEBUG
      throw erro;
    }
  };

  const salvarPerfil = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setSalvando(true);
    const timeoutId = setTimeout(() => {
      console.error('Timeout: salvamento demorou mais de 30 segundos');
      setSalvando(false);
      Alert.alert('Erro de Timeout', 'O salvamento está demorando muito. Verifique sua conexão.');
    }, 30000); // 30 segundos de timeout

    try {
      console.log('Iniciando salvamento do perfil...'); // DEBUG
      console.log('Usuário UID:', usuario.uid); // DEBUG
      
      let fotoBase64 = photoUrl;

      // Converter imagem para Base64 se houver nova imagem
      if (localImage) {
        console.log('Tentando converter imagem para Base64...'); // DEBUG
        try {
          fotoBase64 = await convertToBase64(localImage);
          console.log('Conversão de imagem concluída com sucesso'); // DEBUG
        } catch (erroConversao) {
          console.warn('Conversão de imagem falhou, continuando sem foto:', erroConversao.message); // DEBUG
          fotoBase64 = photoUrl; // Continua com a foto anterior
          Alert.alert('Aviso', 'Não foi possível atualizar a foto, mas o perfil foi salvo.');
        }
      }

      const nomeCompleto = `${perfil.nome.trim()} ${perfil.sobrenome.trim()}`.trim();
      console.log('Nome completo:', nomeCompleto); // DEBUG
      
      const usuarioAtualizado = {};

      if (nomeCompleto) usuarioAtualizado.displayName = nomeCompleto;
      // Nota: Não salvamos Base64 no Auth (muito grande), apenas no Firestore

      if (nomeCompleto) {
        console.log('Atualizando perfil do Firebase Auth:', usuarioAtualizado); // DEBUG
        try {
          await updateProfile(usuario, usuarioAtualizado);
          console.log('Perfil do Auth atualizado com sucesso'); // DEBUG
        } catch (erroAuth) {
          console.error('Erro ao atualizar Auth:', erroAuth.message); // DEBUG
          // Continua mesmo se Auth falhar
        }
      }

      const perfilRef = doc(bancoDados, 'users', usuario.uid);
      const novosDados = {
        nome: perfil.nome || '',
        sobrenome: perfil.sobrenome || '',
        rua: perfil.rua || '',
        bairro: perfil.bairro || '',
        cidade: perfil.cidade || '',
        estado: perfil.estado || '',
        cep: perfil.cep || '',
        telefone: perfil.telefone || '',
        fotoBase64: fotoBase64 || null,
        updatedAt: new Date().toISOString(),
      };

      console.log('Dados a salvar no Firestore:', novosDados); // DEBUG
      console.log('Referência do documento:', `users/${usuario.uid}`); // DEBUG
      
      console.log('Iniciando setDoc no Firestore...'); // DEBUG
      await setDoc(perfilRef, novosDados, { merge: true });
      console.log('Dados salvos no Firestore com sucesso'); // DEBUG

      // Atualizar cache local
      const storageKey = `@perfil_usuario_${usuario.uid}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
      console.log('Cache local atualizado'); // DEBUG

      clearTimeout(timeoutId);
      setSalvando(false);
      setPhotoUrl(fotoBase64);
      setLocalImage(null);
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (erro) {
      clearTimeout(timeoutId);
      console.error('Erro completo ao salvar perfil:', {
        message: erro.message,
        code: erro.code,
        stack: erro.stack,
      }); // DEBUG
      setSalvando(false);
      Alert.alert('Erro ao Salvar', `${erro.message || 'Não foi possível salvar o perfil. Tente novamente.'}`);
    }
  };

  const atualizarCampo = (campo, valor) => {
    setPerfil((anterior) => ({ ...anterior, [campo]: valor }));
  };

  // Estado de carregamento
  if (carregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" color="#A5151D" />
      </View>
    );
  }

  // Renderização
  return (
    <ScrollView contentContainerStyle={estilos.container}>
      {/* Título */}
      <Text style={estilos.titulo}>Perfil do Usuário</Text>

      {/* Avatar */}
      <View style={estilos.avatarContainer}>
        {localImage ? (
          <Image source={{ uri: localImage }} style={estilos.avatar} />
        ) : photoUrl ? (
          <Image source={{ uri: photoUrl }} style={estilos.avatar} />
        ) : (
          <View style={[estilos.avatar, estilos.avatarVazio]}>
            <Text style={estilos.avatarTexto}>Foto</Text>
          </View>
        )}
      </View>

      {/* Botão Alterar Foto */}
      {editando && (
        <TouchableOpacity
          style={estilos.button}
          onPress={selecionarFoto}
          activeOpacity={0.8}
        >
          <Text style={estilos.buttonText}>Alterar Foto</Text>
        </TouchableOpacity>
      )}

      {/* Formulário */}
      <Text style={estilos.label}>Nome</Text>
      <TextInput
        style={estilos.input}
        value={perfil.nome}
        onChangeText={(valor) => atualizarCampo('nome', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Sobrenome</Text>
      <TextInput
        style={estilos.input}
        value={perfil.sobrenome}
        onChangeText={(valor) => atualizarCampo('sobrenome', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Rua</Text>
      <TextInput
        style={estilos.input}
        value={perfil.rua}
        onChangeText={(valor) => atualizarCampo('rua', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Bairro</Text>
      <TextInput
        style={estilos.input}
        value={perfil.bairro}
        onChangeText={(valor) => atualizarCampo('bairro', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Cidade</Text>
      <TextInput
        style={estilos.input}
        value={perfil.cidade}
        onChangeText={(valor) => atualizarCampo('cidade', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Estado</Text>
      <TextInput
        style={estilos.input}
        value={perfil.estado}
        onChangeText={(valor) => atualizarCampo('estado', valor)}
        editable={editando}
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>CEP</Text>
      <TextInput
        style={estilos.input}
        value={perfil.cep}
        onChangeText={(valor) => atualizarCampo('cep', valor)}
        editable={editando}
        keyboardType="numeric"
        placeholderTextColor="#666"
      />

      <Text style={estilos.label}>Telefone Celular</Text>
      <TextInput
        style={estilos.input}
        value={perfil.telefone}
        onChangeText={(valor) => atualizarCampo('telefone', valor)}
        editable={editando}
        keyboardType="phone-pad"
        placeholderTextColor="#666"
      />

      {/* Botões de Ação */}
      {editando ? (
        <>
          <TouchableOpacity
            style={[
              estilos.button,
              salvando && estilos.buttonDisabled,
            ]}
            onPress={salvarPerfil}
            activeOpacity={0.8}
            disabled={salvando}
          >
            <Text style={estilos.buttonText}>
              {salvando ? 'Salvando...' : 'Salvar Perfil'}
            </Text>
          </TouchableOpacity>

          <View style={estilos.espaco} />

          <TouchableOpacity
            style={estilos.buttonSecundario}
            onPress={() => setEditando(false)}
            activeOpacity={0.8}
          >
            <Text style={estilos.buttonTextSecundario}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={estilos.button}
          onPress={() => setEditando(true)}
          activeOpacity={0.8}
        >
          <Text style={estilos.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// === ESTILOS ===
const estilos = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#070707',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#ECECEC',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#A5151D',
  },
  avatarVazio: {
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    color: '#8B8B8B',
    fontSize: 16,
  },
  label: {
    color: '#E5E5E5',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#121212',
    color: '#ECECEC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#A5151D',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  buttonSecundario: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonTextSecundario: {
    color: '#BEBFC4',
    fontWeight: '700',
    fontSize: 16,
  },
  espaco: {
    height: 12,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070707',
  },
});
