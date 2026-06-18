// === IMPORTS ===
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { bancoDados } from '../config/firebaseConfig';

// === CONSTANTES ===
const CAMPOS_INICIAIS = {
  Produto: '',
  Preço: '',
  Descrição: '',
  Foto: '',
  Foto2: '',
  Foto3: '',
  ValorNormal: '',
  ValorDesconto: '',
  Desconto: '',
};

const PRODUTOS_EXEMPLO = [
  {
    Produto: 'EA Sports FC 26',
    Preço: '199.90',
    Descrição:
      'Simulador de futebol com gráficos realistas, modo carreira aprimorado e partidas online competitivas.',
    Foto:
      'https://cdn2.unrealengine.com/fc26-standard-edition-1920x1080.jpg',
    ValorNormal: '299.90',
    ValorDesconto: '100.00',
    Desconto: '33%',
  },
  {
    Produto: 'Rocket League',
    Preço: '59.90',
    Descrição:
      'Misture futebol e carros em partidas rápidas e emocionantes, com modos online e competitivos.',
    Foto: 'https://rocketleague.media.zestyio.com/rl_keyart.jpg',
    ValorNormal: '99.90',
    ValorDesconto: '40.00',
    Desconto: '40%',
  },
  {
    Produto: 'The Witcher 3',
    Preço: '69.90',
    Descrição:
      'RPG de fantasia com um vasto mundo aberto, combates estratégicos e centenas de missões para explorar.',
    Foto: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
    ValorNormal: '139.90',
    ValorDesconto: '70.00',
    Desconto: '50%',
  },
  {
    Produto: 'Forza Horizon 5',
    Preço: '149.90',
    Descrição:
      'Jogo de corrida em mundo aberto ambientado no México, com centenas de carros e eventos dinâmicos.',
    Foto:
      'https://upload.wikimedia.org/wikipedia/en/f/f4/Forza_Horizon_5_cover.jpg',
    ValorNormal: '249.90',
    ValorDesconto: '100.00',
    Desconto: '40%',
  },
];

// === COMPONENTE ===
export default function TelaAdmin() {
  // Estado
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [novoProduto, setNovoProduto] = useState(CAMPOS_INICIAIS);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  // Efeitos
  useEffect(() => {
    const produtosRef = collection(bancoDados, 'produtos');
    const desinscrever = onSnapshot(
      produtosRef,
      (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((docSnap) => {
          lista.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProdutos(lista);
        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao buscar produtos:', erro);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
        setCarregando(false);
      }
    );

    return desinscrever;
  }, []);

  // Funções
  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    const num = parseFloat(valor.toString().replace(',', '.'));
    if (isNaN(num)) return `R$ ${valor}`;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const calcularDesconto = (valoreNormal, preco) => {
    if (!valoreNormal || !preco) return null;
    const normal = parseFloat(valoreNormal.toString().replace(',', '.'));
    const precoNum = parseFloat(preco.toString().replace(',', '.'));
    if (!isNaN(normal) && !isNaN(precoNum) && normal > precoNum) {
      return `${Math.round(((normal - precoNum) / normal) * 100)}%`;
    }
    return null;
  };

  const selecionarImagem = async (campoFoto) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        const uri = resultado.assets[0].uri;
        atualizarCampo(campoFoto, uri);
      }
    } catch (erro) {
      console.error('Erro ao selecionar imagem:', erro);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const atualizarCampo = (campo, valor) => {
    setNovoProduto((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const toggleFormulario = () => {
    if (mostrarFormulario) {
      setNovoProduto(CAMPOS_INICIAIS);
      setEditandoId(null);
    }
    setMostrarFormulario(!mostrarFormulario);
  };

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setNovoProduto({
      Produto: produto.Produto || '',
      Preço: produto.Preço || '',
      Descrição: produto.Descrição || '',
      Foto: produto.Foto || '',
      Foto2: produto.Foto2 || '',
      Foto3: produto.Foto3 || '',
      ValorNormal: produto.ValorNormal || '',
      ValorDesconto: produto.ValorDesconto || '',
      Desconto: produto.Desconto || '',
    });
    setMostrarFormulario(true);
  };

  const salvarProduto = async () => {
    const { Produto, Preço } = novoProduto;
    if (!Produto.trim() || !Preço.trim()) {
      Alert.alert(
        'Atenção',
        'Nome do produto e Preço são obrigatórios.'
      );
      return;
    }

    setSalvando(true);
    try {
      // Formatar preço para padrão brasileiro (R$ 0,00)
      const precoFormatado = formatarMoeda(novoProduto.Preço);
      const valoreNormalFormatado = novoProduto.ValorNormal
        ? formatarMoeda(novoProduto.ValorNormal)
        : '';

      // Calcular desconto automaticamente
      const descontoCalculado = calcularDesconto(
        novoProduto.ValorNormal,
        novoProduto.Preço
      );

      const fotoFinal = novoProduto.Foto.trim()
        ? novoProduto.Foto
        : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';

      const payload = {
        ...novoProduto,
        Preço: precoFormatado,
        Foto: fotoFinal,
        Foto2: novoProduto.Foto2.trim(),
        Foto3: novoProduto.Foto3.trim(),
        Desconto: descontoCalculado || novoProduto.Desconto,
        ValorNormal: valoreNormalFormatado,
        nome: novoProduto.Produto || '',
        preco: precoFormatado || '',
        precoOriginal: valoreNormalFormatado || '',
        imagem: fotoFinal || '',
      };

      if (editandoId) {
        // Atualizar
        const produtoRef = doc(bancoDados, 'produtos', editandoId);
        await updateDoc(produtoRef, { ...payload, updatedAt: new Date() });
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        // Criar novo
        const produtosRef = collection(bancoDados, 'produtos');
        await addDoc(produtosRef, { ...payload, createdAt: new Date() });
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
        // Navegar para a tela de produtos após adicionar
        try {
          navigation.navigate('TelaProdutos');
        } catch (e) {
          // navigation pode não estar disponível em alguns contextos; ignorar falha
          console.warn('Navegação para TelaProdutos falhou:', e);
        }
      }

      setNovoProduto(CAMPOS_INICIAIS);
      setEditandoId(null);
      setMostrarFormulario(false);
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  };

  const deletarProduto = async (id, nome) => {
  console.log('Tentando deletar produto:', { id, nome });

  try {
    console.log('Deletando ID:', id);

    await deleteDoc(doc(bancoDados, 'produtos', id));

    console.log('Produto deletado com sucesso');
    Alert.alert('Sucesso', 'Produto removido com sucesso.');
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    Alert.alert('Erro', erro.message);
  }
};

  const popularProdutosPadrao = async () => {
    setCarregando(true);
    try {
      const produtosRef = collection(bancoDados, 'produtos');
      for (const prod of PRODUTOS_EXEMPLO) {
        await addDoc(produtosRef, { ...prod, createdAt: new Date() });
      }
      Alert.alert(
        'Sucesso',
        'Produtos padrão criados no Firestore para demonstração!'
      );
    } catch (erro) {
      console.error('Erro ao popular produtos:', erro);
      Alert.alert('Erro', 'Falha ao gerar produtos padrão.');
    } finally {
      setCarregando(false);
    }
  };

  // Renderização
  const renderItem = ({ item }) => {
    console.log('Renderizando item:', { id: item.id, produto: item.Produto }); // DEBUG
    
    const desconto =
      item.Desconto ||
      calcularDesconto(item.ValorNormal, item.Preço);

    return (
      <View style={estilos.card}>
        {/* Imagem */}
        <Image
          source={{ uri: item.Foto }}
          style={estilos.imagemProduto}
          resizeMode="cover"
        />

        {/* Botão Deletar */}
        <TouchableOpacity
          style={estilos.botaoDeletar}
          onPress={() => {
            console.log('Botão delete pressionado:', item.id); // DEBUG
            deletarProduto(item.id, item.Produto);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityLabel={`Deletar ${item.Produto}`}
        >
          <Text style={estilos.textoBotaoDeletar}>🗑️</Text>
        </TouchableOpacity>

        {/* Badge de Desconto */}
        {desconto && (
          <View style={estilos.badgeDesconto}>
            <Text style={estilos.textoBadgeDesconto}>{desconto} OFF</Text>
          </View>
        )}

        {/* Informações */}
        <View style={estilos.infoContainer}>
          <Text numberOfLines={2} style={estilos.nomeProduto}>
            {item.Produto}
          </Text>
          {item.Descrição && (
            <Text numberOfLines={1} style={estilos.descricaoProduto}>
              {item.Descrição}
            </Text>
          )}

          <View style={estilos.precosContainer}>
            {item.ValorNormal && (
              <Text style={estilos.precoNormal}>
                {formatarMoeda(item.ValorNormal)}
              </Text>
            )}
            <Text style={estilos.precoVenda}>
              {formatarMoeda(item.Preço)}
            </Text>
            {item.ValorDesconto && (
              <Text style={estilos.valorDesconto}>
                Economize {formatarMoeda(item.ValorDesconto)}
              </Text>
            )}
          </View>

          {/* Botão Editar */}
          <TouchableOpacity
            style={estilos.botaoEditar}
            onPress={() => iniciarEdicao(item)}
          >
            <Text style={estilos.textoBotaoEditar}> Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.container}
    >
      {/* Header */}
      <View style={estilos.header}>
        <Text style={estilos.subtitulo}>
          {produtos.length}{' '}
          {produtos.length === 1 ? 'produto' : 'produtos'}
        </Text>
        <TouchableOpacity
          style={estilos.botaoToggleForm}
          onPress={toggleFormulario}
        >
          <Text style={estilos.textoBotaoToggleForm}>
            {mostrarFormulario
              ? editandoId
                ? 'Fechar Edição ✖'
                : 'Fechar Cadastro ✖'
              : 'Novo Produto'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      {mostrarFormulario && (
        <ScrollView style={estilos.formulario} showsVerticalScrollIndicator={true}>
          <Text style={estilos.tituloFormulario}>
            {editandoId
              ? 'Editar Produto'
              : 'Cadastrar Novo Produto'}
          </Text>

          <TextInput
            placeholder="Nome do Produto *"
            style={estilos.input}
            value={novoProduto.Produto}
            onChangeText={(v) => atualizarCampo('Produto', v)}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Descrição (Opcional)"
            style={estilos.input}
            value={novoProduto.Descrição}
            onChangeText={(v) => atualizarCampo('Descrição', v)}
            placeholderTextColor="#999"
          />

          <View style={estilos.inputLinha}>
            <TextInput
              placeholder="Preço Venda *"
              keyboardType="numeric"
              style={[estilos.input, { flex: 1, marginRight: 8 }]}
              value={novoProduto.Preço}
              onChangeText={(v) => atualizarCampo('Preço', v)}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Preço Normal"
              keyboardType="numeric"
              style={[estilos.input, { flex: 1 }]}
              value={novoProduto.ValorNormal}
              onChangeText={(v) =>
                atualizarCampo('ValorNormal', v)
              }
              placeholderTextColor="#999"
            />
          </View>

          <View style={estilos.inputLinha}>
            <TextInput
              placeholder="Valor Desconto R$"
              keyboardType="numeric"
              style={[estilos.input, { flex: 1, marginRight: 8 }]}
              value={novoProduto.ValorDesconto}
              onChangeText={(v) =>
                atualizarCampo('ValorDesconto', v)
              }
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Desconto %"
              style={[estilos.input, { flex: 1 }]}
              value={novoProduto.Desconto}
              onChangeText={(v) => atualizarCampo('Desconto', v)}
              placeholderTextColor="#999"
            />
          </View>

          {/* Foto Principal */}
          <View style={estilos.secaoFoto}>
            <Text style={estilos.tituloSecaoFoto}>Foto Principal</Text>
            <TextInput
              placeholder="URL da Foto Principal"
              style={estilos.input}
              value={novoProduto.Foto}
              onChangeText={(v) => atualizarCampo('Foto', v)}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={estilos.botaoEscolherArquivo}
              onPress={() => selecionarImagem('Foto')}
            >
              <Text style={estilos.textoEscolherArquivo}>📁 Escolher do Arquivo</Text>
            </TouchableOpacity>

            {novoProduto.Foto && novoProduto.Foto.trim().length > 0 && (
              <View style={estilos.previewContainer}>
                <Text style={estilos.labelPreview}>Preview:</Text>
                <Image
                  source={{ uri: novoProduto.Foto }}
                  style={estilos.previewImage}
                  resizeMode="cover"
                  onError={() => console.warn('Erro ao carregar preview da imagem')}
                />
              </View>
            )}
          </View>

          {/* Foto 2 */}
          <View style={estilos.secaoFoto}>
            <Text style={estilos.tituloSecaoFoto}>Foto 2 (Opcional)</Text>
            <TextInput
              placeholder="URL da Foto 2"
              style={estilos.input}
              value={novoProduto.Foto2}
              onChangeText={(v) => atualizarCampo('Foto2', v)}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={estilos.botaoEscolherArquivo}
              onPress={() => selecionarImagem('Foto2')}
            >
              <Text style={estilos.textoEscolherArquivo}>📁 Escolher do Arquivo</Text>
            </TouchableOpacity>

            {novoProduto.Foto2 && novoProduto.Foto2.trim().length > 0 && (
              <View style={estilos.previewContainer}>
                <Text style={estilos.labelPreview}>Preview:</Text>
                <Image
                  source={{ uri: novoProduto.Foto2 }}
                  style={estilos.previewImage}
                  resizeMode="cover"
                  onError={() => console.warn('Erro ao carregar preview da foto 2')}
                />
              </View>
            )}
          </View>

          {/* Foto 3 */}
          <View style={estilos.secaoFoto}>
            <Text style={estilos.tituloSecaoFoto}>Foto 3 (Opcional)</Text>
            <TextInput
              placeholder="URL da Foto 3"
              style={estilos.input}
              value={novoProduto.Foto3}
              onChangeText={(v) => atualizarCampo('Foto3', v)}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={estilos.botaoEscolherArquivo}
              onPress={() => selecionarImagem('Foto3')}
            >
              <Text style={estilos.textoEscolherArquivo}>📁 Escolher do Arquivo</Text>
            </TouchableOpacity>

            {novoProduto.Foto3 && novoProduto.Foto3.trim().length > 0 && (
              <View style={estilos.previewContainer}>
                <Text style={estilos.labelPreview}>Preview:</Text>
                <Image
                  source={{ uri: novoProduto.Foto3 }}
                  style={estilos.previewImage}
                  resizeMode="cover"
                  onError={() => console.warn('Erro ao carregar preview da foto 3')}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              estilos.botaoSalvar,
              salvando && estilos.botaoDesativado,
            ]}
            onPress={salvarProduto}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.textoBotaoSalvar}>
                {editandoId
                  ? 'Salvar Alterações'
                  : 'Salvar Produto'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Conteúdo */}
      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color="#A5151D" />
          <Text style={estilos.textoCarregando}>
            Carregando produtos...
          </Text>
        </View>
      ) : produtos.length === 0 ? (
        <View style={estilos.semProdutos}>
          <Text style={estilos.textoSemProdutos}>
            Nenhum produto cadastrado.
          </Text>
          <TouchableOpacity
            style={estilos.botaoPopular}
            onPress={popularProdutosPadrao}
          >
            <Text style={estilos.textoBotaoPopular}>
               Gerar Produtos de Exemplo
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={estilos.linhaGrid}
          contentContainerStyle={estilos.lista}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// === ESTILOS ===
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#070707',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  subtitulo: {
    fontSize: 16,
    color: '#ECECEC',
    fontWeight: '600',
  },
  botaoToggleForm: {
    backgroundColor: '#A5151D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
  },
  textoBotaoToggleForm: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  formulario: {
    backgroundColor: '#121212',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  tituloFormulario: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#ECECEC',
  },
  input: {
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#ECECEC',
  },
  inputLinha: {
    flexDirection: 'row',
    gap: 8,
  },
  secaoFoto: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E2E',
  },
  tituloSecaoFoto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BEBFC4',
    marginBottom: 8,
  },
  botaoEscolherArquivo: {
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#A5151D',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  textoEscolherArquivo: {
    color: '#A5151D',
    fontSize: 13,
    fontWeight: '600',
  },
  labelPreview: {
    fontSize: 12,
    fontWeight: '600',
    color: '#BEBFC4',
    marginBottom: 8,
  },
  previewContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    backgroundColor: '#111',
  },
  botaoSalvar: {
    backgroundColor: '#A5151D',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoCarregando: {
    marginTop: 12,
    color: '#BEBFC4',
    fontSize: 14,
  },
  semProdutos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoSemProdutos: {
    fontSize: 16,
    color: '#BEBFC4',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoPopular: {
    backgroundColor: '#A5151D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  textoBotaoPopular: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  lista: {
    padding: 12,
  },
  linhaGrid: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: '#121212',
    width: '48%',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    elevation: 3,
  },
  imagemProduto: {
    width: '100%',
    height: 140,
    backgroundColor: '#1F1F1F',
  },
  botaoDeletar: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textoBotaoDeletar: {
    fontSize: 14,
  },
  badgeDesconto: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#E91E63',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  textoBadgeDesconto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 12,
  },
  nomeProduto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ECECEC',
    marginBottom: 4,
    lineHeight: 18,
  },
  descricaoProduto: {
    fontSize: 12,
    color: '#BEBFC4',
    marginBottom: 8,
  },
  precosContainer: {
    marginBottom: 10,
  },
  precoNormal: {
    fontSize: 12,
    color: '#A5151D',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  precoVenda: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  valorDesconto: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 2,
  },
  botaoEditar: {
    backgroundColor: '#A5151D',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoEditar: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});