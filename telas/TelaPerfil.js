// === IMPORTS ===
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
    armazenamento,
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
        setCarregando(false);
        return;
      }

      const storageKey = `@perfil_usuario_${usuario.uid}`;

      // 1. Ler dados do AsyncStorage para exibição instantânea
      try {
        const perfilLocal = await AsyncStorage.getItem(storageKey);
        if (perfilLocal) {
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
        const perfilRef = doc(bancoDados, 'users', usuario.uid);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
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
            fotoUrl: dados.fotoUrl || usuario.photoURL || null,
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
          setPhotoUrl(novosDados.fotoUrl);
          setEditando(false);

          // Atualizar cache local
          await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
        } else {
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
            fotoUrl: usuario.photoURL || null,
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
          setPhotoUrl(dadosPadrao.fotoUrl);
          setEditando(true);

          // Salvar dados padrão no cache
          await AsyncStorage.setItem(storageKey, JSON.stringify(dadosPadrao));
        }
      } catch (erro) {
        console.error('Erro ao buscar dados do Firestore:', erro);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      setLocalImage(resultado.assets[0].uri);
    } else if (!resultado.cancelled && resultado.uri) {
      setLocalImage(resultado.uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imagemRef = ref(
      armazenamento,
      `profilePictures/${usuario.uid}/${Date.now()}`
    );
    const snapshot = await uploadBytes(imagemRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  const salvarPerfil = async () => {
    if (!usuario) {
      return;
    }

    setSalvando(true);
    try {
      let uploadedUrl = photoUrl;

      if (localImage) {
        uploadedUrl = await uploadImageAsync(localImage);
      }

      const nomeCompleto = `${perfil.nome.trim()} ${perfil.sobrenome.trim()}`.trim();
      const usuarioAtualizado = {};

      if (nomeCompleto) usuarioAtualizado.displayName = nomeCompleto;
      if (uploadedUrl) usuarioAtualizado.photoURL = uploadedUrl;

      if (Object.keys(usuarioAtualizado).length > 0) {
        await updateProfile(usuario, usuarioAtualizado);
      }

      const perfilRef = doc(bancoDados, 'users', usuario.uid);
      const novosDados = {
        nome: perfil.nome,
        sobrenome: perfil.sobrenome,
        rua: perfil.rua,
        bairro: perfil.bairro,
        cidade: perfil.cidade,
        estado: perfil.estado,
        cep: perfil.cep,
        telefone: perfil.telefone,
        fotoUrl: uploadedUrl || null,
        updatedAt: new Date(),
      };

      await setDoc(perfilRef, novosDados, { merge: true });

      // Atualizar cache local
      const storageKey = `@perfil_usuario_${usuario.uid}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));

      setPhotoUrl(uploadedUrl);
      setLocalImage(null);
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSalvando(false);
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
