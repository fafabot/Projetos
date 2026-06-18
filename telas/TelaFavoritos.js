// === IMPORTS ===
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { onSnapshot, collection } from 'firebase/firestore';
import { bancoDados } from '../config/firebaseConfig';
import { useFavorites } from '../context/FavoritesContext';

// === DADOS ===
const jogosFixos = [
  {
    id: '1',
    nome: 'Cuphead',
    descricao: 'R$ 49,90',
    imagem: require('../assets/imagemjogos/cuphead.jpg'),
  },
  {
    id: '2',
    nome: 'Assasins Creed Origins',
    descricao: 'R$ 119,90',
    imagem: require('../assets/imagemjogos/assasins creed origins.jpg'),
  },
  {
    id: '3',
    nome: 'God of War Ragnarok',
    descricao: 'R$ 249,90',
    imagem: require('../assets/imagemjogos/god of war ragnarol.jpg'),
  },
  {
    id: '4',
    nome: 'Hollow Knight',
    descricao: 'R$ 39,90',
    imagem: require('../assets/imagemjogos/hollow knight.jpg'),
  },
  {
    id: '5',
    nome: 'Red Dead Redemption 2',
    descricao: 'R$ 149,90',
    imagem: require('../assets/imagemjogos/red dead remdepmtion 2.jpg'),
  },
  {
    id: '6',
    nome: 'The Last of Us II',
    descricao: 'R$ 199,90',
    imagem: require('../assets/imagemjogos/the last of us II.jpg'),
  },
  {
    id: '7',
    nome: 'Resident Evil Biohazard',
    descricao: 'R$ 179,90',
    imagem: require('../assets/imagemjogos/resident Evil biogazard.jpg'),
  },
];

const promocoesEspeciais = [
  {
    id: 'p1',
    nome: 'GTA V',
    descricao: 'R$ 79,90',
    imagem: require('../assets/imagemjogos/GTA V.jpg'),
  },
  {
    id: 'p2',
    nome: 'Minecraft',
    descricao: 'R$ 59,90',
    imagem: require('../assets/imagemjogos/minecraft.jpg'),
  },
  {
    id: 'p3',
    nome: 'Elden Ring',
    descricao: 'R$ 189,90',
    imagem: require('../assets/imagemjogos/elden ring.jpg'),
  },
];

// === COMPONENTE ===
export default function TelaFavoritos() {
  // Hooks
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [produtosBancoDados, setProdutosBancoDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Buscar produtos do Firebase
  useEffect(() => {
    const produtosRef = collection(bancoDados, 'produtos');
    const desinscrever = onSnapshot(
      produtosRef,
      (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((docSnap) => {
          const dados = docSnap.data();
          lista.push({
            id: docSnap.id,
            nome: dados.Produto || dados.nome,
            descricao: dados.Preço || dados.preco,
            imagem: { uri: dados.Foto || dados.imagem },
          });
        });
        setProdutosBancoDados(lista);
        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao buscar produtos do Firebase:', erro);
        setCarregando(false);
      }
    );

    return desinscrever;
  }, []);

  // Unificar dados locais com Firebase e filtrar favoritos
  const todosProdutos = [...jogosFixos, ...promocoesEspeciais, ...produtosBancoDados];
  const favoritos = todosProdutos.filter((produto) =>
    favorites.includes(produto.id)
  );

  // Renderização
  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />

      {/* Header */}
      <View style={estilos.header}>
        <TouchableOpacity
          style={estilos.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={estilos.title}>Meus Favoritos</Text>
      </View>

      {/* Conteúdo */}
      {carregando ? (
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color="#A5151D" />
          <Text style={estilos.carregandoTexto}>Carregando favoritos...</Text>
        </View>
      ) : favoritos.length === 0 ? (
        <View style={estilos.emptyContainer}>
          <Text style={estilos.emptyText}>
            Você ainda não favoritou nenhum jogo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.listContent}
          renderItem={({ item }) => (
            <View style={estilos.card}>
              <Image
                source={
                  typeof item.imagem === 'string' || item.imagem.uri
                    ? item.imagem
                    : item.imagem
                }
                style={estilos.image}
                resizeMode="cover"
              />

              <View style={estilos.info}>
                <Text style={estilos.name}>{item.nome}</Text>
                <Text style={estilos.price}>{item.descricao}</Text>
              </View>

              <TouchableOpacity
                style={estilos.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Text
                  style={[
                    estilos.favoriteIcon,
                    {
                      color: isFavorite(item.id) ? '#E91E63' : '#FFFFFF',
                    },
                  ]}
                >
                  ♥
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// === ESTILOS ===
const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  title: {
    color: '#ECECEC',
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#A5151D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carregandoTexto: {
    color: '#BEBFC4',
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#BEBFC4',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#ECECEC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 26,
  },
});
