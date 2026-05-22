import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function TelaDetalheProduto() {
  const route = useRoute();
  const navigation = useNavigation();
  const produto = route.params?.produto || {};
  const { isFavorite, toggleFavorite } = useFavorites();
  const pid = produto.id ?? produto.nome ?? null;
  const windowHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />
      <ScrollView contentContainerStyle={estilos.content}>
        <View style={estilos.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.backButton}>
            <Text style={estilos.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.cardDetail}>
          {produto.imagem && (
            <Image source={produto.imagem} style={[estilos.detailImage, { height: windowHeight * 0.5 }]} resizeMode="cover" />
          )}

          <TouchableOpacity style={estilos.favoriteButtonDetail} onPress={() => toggleFavorite(pid)}>
            <Text style={[estilos.favoriteIconDetail, { color: isFavorite(pid) ? '#E91E63' : '#888' }]}>
              {isFavorite(pid) ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>

          <Text style={estilos.detailName}>{produto.nome}</Text>
          <Text style={estilos.detailPrice}>{produto.preco ?? produto.descricao}</Text>
          {produto.preco ? <Text style={estilos.detailDescription}>{produto.descricao}</Text> : null}
          <Text style={estilos.installmentText}>em até 12 vezes no cartão sem juros</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  cardDetail: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailName: {
    color: '#ECECEC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailPrice: {
    color: '#4CAF50',
    fontSize: 30,
    fontWeight: '700',
  },
  detailDescription: {
    color: '#BEBFC4',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  installmentText: {
    color: '#BEBFC4',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  headerRow: {
    width: '100%',
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#A5151D',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#fff',
    fontWeight: '700',
  },
  favoriteButtonDetail: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
  favoriteIconDetail: {
    fontSize: 36,
  },
});
