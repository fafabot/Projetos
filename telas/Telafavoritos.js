import { useNavigation } from '@react-navigation/native';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const jogos = [
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

export default function TelaFavoritos() {
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const favoritos = jogos.filter((jogo) => favorites.includes(jogo.id));

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />
      <View style={estilos.header}>
        <TouchableOpacity style={estilos.backButton} onPress={() => navigation.goBack()}>
          <Text style={estilos.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={estilos.title}>Meus Favoritos</Text>
      </View>

      {favoritos.length === 0 ? (
        <View style={estilos.emptyContainer}>
          <Text style={estilos.emptyText}>Você ainda não favoritou nenhum jogo.</Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.listContent}
          renderItem={({ item }) => (
            <View style={estilos.card}>
              <Image source={item.imagem} style={estilos.image} resizeMode="cover" />
              <View style={estilos.info}>
                <Text style={estilos.name}>{item.nome}</Text>
                <Text style={estilos.price}>{item.descricao}</Text>
              </View>
              <TouchableOpacity style={estilos.favoriteButton} onPress={() => toggleFavorite(item.id)}>
                <Text style={[estilos.favoriteIcon, { color: isFavorite(item.id) ? '#E91E63' : '#888' }]}>♥</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    color: '#ECECEC',
    fontSize: 22,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#BEBFC4',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 22,
  },
});