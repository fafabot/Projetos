import { useNavigation } from '@react-navigation/native';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const jogos = [
  {
    id: '1',
    nome: 'Cuphead',
    precoOriginal: 'R$ 79,90',
    preco: 'R$ 49,90',
    imagem: require('../assets/imagemjogos/cuphead.jpg'),
  },
  {
    id: '2',
    nome: 'Assasins Creed Origins',
    precoOriginal: 'R$ 199,90',
    preco: 'R$ 119,90',
    imagem: require('../assets/imagemjogos/assasins creed origins.jpg'),
  },
  {
    id: '3',
    nome: 'God of War Ragnarok',
    precoOriginal: 'R$ 349,90',
    preco: 'R$ 249,90',
    imagem: require('../assets/imagemjogos/god of war ragnarol.jpg'),
  },
  {
    id: '4',
    nome: 'Hollow Knight',
    precoOriginal: 'R$ 59,90',
    preco: 'R$ 39,90',
    imagem: require('../assets/imagemjogos/hollow knight.jpg'),
  },
  {
    id: '5',
    nome: 'Red Dead Redemption 2',
    precoOriginal: 'R$ 249,90',
    preco: 'R$ 149,90',
    imagem: require('../assets/imagemjogos/red dead remdepmtion 2.jpg'),
  },
  {
    id: '6',
    nome: 'The Last of Us II',
    precoOriginal: 'R$ 299,90',
    preco: 'R$ 199,90',
    imagem: require('../assets/imagemjogos/the last of us II.jpg'),
  },
  {
    id: '7',
    nome: 'Resident Evil Biohazard',
    precoOriginal: 'R$ 229,90',
    preco: 'R$ 179,90',
    imagem: require('../assets/imagemjogos/resident Evil biogazard.jpg'),
  },
];

export default function TelaProdutos() {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const renderItem = ({ item }) => (
    <View style={estilos.card}>
      <Image source={item.imagem} style={estilos.image} resizeMode="cover" />

      <View style={estilos.info}>
        <Text style={estilos.name}>{item.nome}</Text>
        <Text style={estilos.price}>{item.preco}</Text>
        <Text style={estilos.precoOriginal}>{item.precoOriginal}</Text>

        <View style={estilos.cardButtons}>
          <TouchableOpacity
            style={estilos.botaoInstalar}
            onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
          >
            <Text style={estilos.textoBotao}>Ver Mais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <View style={estilos.favoriteBackground}>
              <Text
                style={[
                  estilos.favoriteIcon,
                  { color: isFavorite(item.id) ? '#E91E63' : '#888' },
                ]}
              >
                {isFavorite(item.id) ? '♥' : '♡'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />

      <View style={estilos.header}>
        <Text style={estilos.title}>Produtos</Text>
        <TouchableOpacity
          style={estilos.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.listContent}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#1F1F1F',
    borderBottomWidth: 1,
  },
  title: {
    color: '#ECECEC',
    fontSize: 24,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: '#A5151D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    overflow: 'hidden',
    marginBottom: 14,
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    color: '#ECECEC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  botaoInstalar: {
    backgroundColor: '#A5151D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  precoOriginal: {
    color: '#b40202',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
});