// === IMPORTS ===
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

// === COMPONENTE ===
export default function TelaDetalheProduto() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const produto = route.params?.produto || {};
  const pid = produto.id ?? produto.nome ?? null;
  const windowHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />

      {/* Header com Botão Voltar e Nome */}
      <View style={estilos.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={estilos.backButton}
        >
          <Text style={estilos.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={estilos.productNameText}>{produto.nome || 'Produto'}</Text>
      </View>

      {/* Conteúdo Scrollável */}
      <ScrollView
        contentContainerStyle={estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Imagem */}
        {produto.imagem && (
          <View style={estilos.imageSection}>
            <Image
              source={produto.imagem}
              style={estilos.mainImage}
              resizeMode="cover"
            />

            {/* Botão Favorito */}
            <TouchableOpacity
              style={estilos.favoriteButton}
              onPress={() => toggleFavorite(pid)}
            >
              <View style={estilos.favoriteBackground}>
                <Text style={[estilos.favoriteIcon, 
                  { color: isFavorite(pid) ? '#E91E63' : '#FFF' }
                ]}>
                  {isFavorite(pid) ? '♥' : '♡'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Conteúdo Principal */}
        <View style={estilos.content}>
          {/* Preço Original */}
          {produto.precoOriginal ? (
            <Text style={estilos.originalPrice}>
              {produto.precoOriginal}
            </Text>
          ) : null}

          {/* Preço */}
          <Text style={estilos.price}>
            {produto.preco || produto.descricao}
          </Text>

          {/* Parcelamento */}
          <Text style={estilos.installmentText}>
            em até 12 vezes de R$ sem juros no cartão
          </Text>

          {/* Botões de Ação */}
          <TouchableOpacity
            style={estilos.buyButton}
            activeOpacity={0.8}
          >
            <Text style={estilos.buyButtonText}>Comprar agora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.cartButton}
            activeOpacity={0.8}
          >
            <Text style={estilos.cartButtonText}>Adicionar ao carrinho</Text>
          </TouchableOpacity>

          {/* Detalhes do Produto */}
          <View style={estilos.detailsSection}>
            <View style={estilos.detailsHeader}>
              <Text style={estilos.detailsTitle}>Detalhes do Produto:</Text>
              <Text style={estilos.viewMoreIcon}>›</Text>
            </View>

            <Text style={estilos.detailsText}>
              {produto.descricao ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed sapien facilisis, sollicitudin sagittis diam accumsan ullamcorper sed. Vestibulum sodales etiam elusmod. Sed nisl orci interdum sed.'}
            </Text>

            <TouchableOpacity>
              <Text style={estilos.viewMoreLink}>Ver mais ›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

// === ESTILOS ===
const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },

  topBar: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  backButtonText: {
    color: '#ECECEC',
    fontSize: 20,
    fontWeight: '700',
  },

  productNameText: {
    color: '#ECECEC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  imageSection: {
    position: 'relative',
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#252525',
    elevation: 3,
  },

  mainImage: {
    width: '100%',
    height: 500,
  },

  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
  },

  favoriteBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteIcon: {
    fontSize: 28,
    fontWeight: '700',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },

  originalPrice: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },

  price: {
    color: '#4CAF50',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },

  installmentText: {
    color: '#BEBFC4',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },



  buyButton: {
    backgroundColor: '#A5151D',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },

  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cartButton: {
    backgroundColor: '#ECECEC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 2,
  },

  cartButtonText: {
    color: '#070707',
    fontSize: 16,
    fontWeight: '700',
  },

  detailsSection: {
    backgroundColor: '#121212',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    padding: 16,
    marginBottom: 20,
  },

  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  detailsTitle: {
    color: '#ECECEC',
    fontSize: 15,
    fontWeight: '700',
  },

  viewMoreIcon: {
    color: '#A5151D',
    fontSize: 20,
    fontWeight: '700',
  },

  detailsText: {
    color: '#BEBFC4',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },

  viewMoreLink: {
    color: '#A5151D',
    fontSize: 13,
    fontWeight: '600',
  },


});
