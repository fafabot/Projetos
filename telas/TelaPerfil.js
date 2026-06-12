import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { armazenamento, autenticacao, bancoDados } from '../config/firebaseConfig';
const camposIniciais = {
    nome: '',
    sobrenome: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
}; export default function TelaPerfil() {
    const [perfil, setPerfil] = useState(camposIniciais);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [localImage, setLocalImage] = useState(null);
    const [editando, setEditando] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false); const usuario = autenticacao.currentUser; useEffect(() => {
        const carregarDados = async () => {
            if (!usuario) {
                setCarregando(false);
                return;
            } const storageKey = '@perfil_usuario_' + usuario.uid;
            // 1. Tentar ler do AsyncStorage primeiro para exibição instantânea
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
                    // Ocultar o carregando inicial caso já tenhamos dados locais
                    setCarregando(false);
                }
            } catch (e) {
                console.error("Erro ao carregar dados locais do perfil:", e);
            }// 2. Fazer requisição ao Firestore em segundo plano para obter os dados mais atualizados
            try {
                const perfilRef = doc(bancoDados, 'users', usuario.uid);
                const perfilSnap = await getDoc(perfilRef); if (perfilSnap.exists()) {
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
                    setEditando(false);// Atualizar o cache local no AsyncStorage
                    await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
                } else {
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
                    }; setPerfil({
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
                    setEditando(true);// Salvar dados padrão no cache local do AsyncStorage
                    await AsyncStorage.setItem(storageKey, JSON.stringify(dadosPadrao));
                }
            } catch (erro) {
                console.error("Erro ao buscar dados do Firestore:", erro);
                // Exibir erro apenas se não conseguimos carregar nada localmente
                const perfilLocal = await AsyncStorage.getItem(storageKey);
                if (!perfilLocal) {
                    Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
                }
            } finally {
                setCarregando(false);
            }
        }; carregarDados();
    }, [usuario]); const selecionarFoto = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.status !== 'granted') {
            Alert.alert(
                'Permissão necessária',
                'Permita o acesso à galeria para escolher a foto de perfil.'
            );
            return;
        } const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        }); if (!resultado.canceled && resultado.assets?.length > 0) {
            setLocalImage(resultado.assets[0].uri);
        } else if (!resultado.cancelled && resultado.uri) {
            setLocalImage(resultado.uri);
        }
    }; const uploadImageAsync = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const imagemRef = ref(armazenamento, `profilePictures/${usuario.uid}/${Date.now()}`);
        const snapshot = await uploadBytes(imagemRef, blob);
        return await getDownloadURL(snapshot.ref);
    }; const salvarPerfil = async () => {
        if (!usuario) {
            return;
        } setSalvando(true);
        try {
            let uploadedUrl = photoUrl; if (localImage) {
                uploadedUrl = await uploadImageAsync(localImage);
            } const nomeCompleto = `${perfil.nome.trim()} ${perfil.sobrenome.trim()}`.trim();
            const usuarioAtualizado = {};
            if (nomeCompleto) usuarioAtualizado.displayName = nomeCompleto;
            if (uploadedUrl) usuarioAtualizado.photoURL = uploadedUrl; if (Object.keys(usuarioAtualizado).length > 0) {
                await updateProfile(usuario, usuarioAtualizado);
            } const perfilRef = doc(bancoDados, 'users', usuario.uid);
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
            }; await setDoc(perfilRef, novosDados, { merge: true });// Salvar os novos dados no AsyncStorage localmente também
            const storageKey = '@perfil_usuario_' + usuario.uid;
            await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados)); setPhotoUrl(uploadedUrl);
            setLocalImage(null);
            setEditando(false);
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }; const atualizarCampo = (campo, valor) => {
        setPerfil((anterior) => ({ ...anterior, [campo]: valor }));
    }; if (carregando) {
        return (
            <View style={estilos.centralizado}>
                <ActivityIndicator size="large" />
            </View>
        );
    } return (
        <ScrollView contentContainerStyle={estilos.container}>
            <Text style={estilos.titulo}>Perfil do Usuário</Text>
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
            </View>{editando && (
                <Button title="Alterar Foto" onPress={selecionarFoto} color="#9D1212" />
            )}<Text style={estilos.label}>Nome</Text>
            <TextInput
                style={estilos.input}
                value={perfil.nome}
                onChangeText={(valor) => atualizarCampo('nome', valor)}
                editable={editando}
            /><Text style={estilos.label}>Sobrenome</Text>
            <TextInput
                style={estilos.input}
                value={perfil.sobrenome}
                onChangeText={(valor) => atualizarCampo('sobrenome', valor)}
                editable={editando}
            /><Text style={estilos.label}>Rua</Text>
            <TextInput
                style={estilos.input}
                value={perfil.rua}
                onChangeText={(valor) => atualizarCampo('rua', valor)}
                editable={editando}
            /><Text style={estilos.label}>Bairro</Text>
            <TextInput
                style={estilos.input}
                value={perfil.bairro}
                onChangeText={(valor) => atualizarCampo('bairro', valor)}
                editable={editando}
            /><Text style={estilos.label}>Cidade</Text>
            <TextInput
                style={estilos.input}
                value={perfil.cidade}
                onChangeText={(valor) => atualizarCampo('cidade', valor)}
                editable={editando}
            /><Text style={estilos.label}>Estado</Text>
            <TextInput
                style={estilos.input}
                value={perfil.estado}
                onChangeText={(valor) => atualizarCampo('estado', valor)}
                editable={editando}
            /><Text style={estilos.label}>CEP</Text>
            <TextInput
                style={estilos.input}
                value={perfil.cep}
                onChangeText={(valor) => atualizarCampo('cep', valor)}
                editable={editando}
                keyboardType="numeric"
            /><Text style={estilos.label}>Telefone celular</Text>
            <TextInput
                style={estilos.input}
                value={perfil.telefone}
                onChangeText={(valor) => atualizarCampo('telefone', valor)}
                editable={editando}
                keyboardType="phone-pad"
            />{editando ? (
                <>
                    <Button title={salvando ? 'Salvando...' : 'Salvar Perfil'} onPress={salvarPerfil} disabled={salvando} color="#9D1212" />
                    <View style={estilos.espaco} />
                    <Button title="Cancelar" onPress={() => setEditando(false)} color="#9D1212" />
                </>
            ) : (
                <Button title="Editar Perfil" onPress={() => setEditando(true)} color="#9D1212" />
            )}
        </ScrollView>
    );
}
const estilos = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#000000',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        borderWidth: 1,

        borderColor: '#2e2e2e',
        borderRadius: 8,
        marginBottom: 12,
        padding: 10,
        color: '#fff',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 12,
    },
    avatarVazio: {
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexto: {
        color: '#fff',
        fontSize: 16,
    },
    centralizado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    label: {
        color: '#fff',
        marginBottom: 6,
    },
    espaco: {
        height: 10,
    },
    button: {
        backgroundColor: '#A5151D',
    },

});