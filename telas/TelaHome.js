// === IMPORTS ===
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { autenticacao } from '../config/firebaseConfig';
import { useFavorites } from '../context/FavoritesContext';

// === DADOS ===
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
    descricao: 'Açãoc e aventura no Egito antigo.',
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

const promocoesEspeciais = [
  {
    id: 'p1',
    nome: 'GTA V',
    precoOriginal: 'R$ 149,90',
    preco: 'R$ 79,90',
    imagem: require('../assets/imagemjogos/GTA V.jpg'),
  },
  {
    id: 'p2',
    nome: 'Minecraft',
    precoOriginal: 'R$ 99,90',
    preco: 'R$ 59,90',
    imagem: require('../assets/imagemjogos/minecraft.jpg'),
  },
  {
    id: 'p3',
    nome: 'Elden Ring',
    precoOriginal: 'R$ 299,90',
    preco: 'R$ 189,90',
    imagem: require('../assets/imagemjogos/elden ring.jpg'),
  },
];

// === COMPONENTE ===
export default function TelaHome() {
  // Hooks
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');

  // Efeitos
  useEffect(() => {
    const atualizarUsuario = async () => {
      if (autenticacao.currentUser) {
        await autenticacao.currentUser.reload();
        setNomeUsuario(autenticacao.currentUser?.displayName || 'Usuário');
      }
    };
    atualizarUsuario();
  }, []);

  // Funções
  const fazerLogout = () => {
    signOut(autenticacao);
  };

  const renderItem = ({ item }) => (
    <View style={estilos.cardWrapper}>
      <View style={estilos.card}>
        <View style={estilos.cardLeft}>
          <View style={estilos.imagemContainer}>
            <Image source={item.imagem} style={estilos.logo} resizeMode="cover" />
          </View>

          <View style={estilos.info}>
            <Text style={estilos.nome}>{item.nome}</Text>

            <View style={estilos.precoContainer}>
              <Text style={estilos.precoOriginal}>{item.precoOriginal}</Text>
              <Text style={estilos.descricao}>{item.preco}</Text>
            </View>

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
                  <Text style={estilos.favoriteIcon}>
                    {isFavorite(item.id) ? '♥' : '♡'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Renderização
  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#070707" />

      <View style={estilos.container}>
        <View style={estilos.backgroundShapeTop} />
        <View style={estilos.backgroundShapeMid} />
        <View style={estilos.backgroundShapeBottom} />

        <ScrollView
          style={estilos.scroll}
          contentContainerStyle={estilos.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.content}>
            {/* Barra Superior */}
            <View style={estilos.topBar}>
              <View style={estilos.userBoxSmall}>
                <Text style={estilos.userLabel}>LOGADO COMO</Text>
                <Text style={estilos.userEmail}>{nomeUsuario}</Text>
              </View>

              <View style={estilos.rightTopBar}>
                <TouchableOpacity
                  style={estilos.logoutButton}
                  onPress={fazerLogout}
                >
                  <Text style={estilos.buttonText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Header Principal */}
            <View style={estilos.headerCenter}>
              <Image
                source={require('../assets/logo.png')}
                style={estilos.logoPrincipal}
              />
              <Text style={estilos.title}>KEY FORGE</Text>
              <Text style={estilos.subtitle}>SUA BIBLIOTECA DE TECNOLOGIAS</Text>
            </View>

            {/* Seção Promoções */}
            <View style={estilos.promoHeaderRow}>
              <Text style={estilos.sectionTitle2}>Promoções Especiais</Text>
              <TouchableOpacity
                style={estilos.favoritosButton}
                onPress={() => navigation.navigate('FavoritosModal')}
              >
                <Text style={estilos.favoritosButtonText}>Meus Favoritos</Text>
              </TouchableOpacity>
            </View>

            {/* Cards de Promoção */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.highlightRow}
            >
              {promocoesEspeciais.map((item) => (
                <View style={estilos.highlightCard} key={item.id}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('DetalheProduto', { produto: item })
                    }
                  >
                    <Image
                      source={item.imagem}
                      style={estilos.highlightImage}
                      resizeMode="cover"
                    />
                    <Text style={estilos.highlightName}>{item.nome}</Text>
                    <Text style={estilos.highlightPrice}>{item.preco}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={estilos.favoriteButtonPromo}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <View style={estilos.favoriteBackgroundPromo}>
                      <Text
                        style={[
                          estilos.favoriteIconPromo,
                          {
                            color: isFavorite(item.id) ? '#E91E63' : '#888',
                          },
                        ]}
                      >
                        {isFavorite(item.id) ? '♥' : '♡'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Seção Em Alta */}
            <View style={estilos.emAltaContainer}>
              <View style={estilos.sectionHeaderRow}>
                <Text style={estilos.sectionTitle}>Em Alta</Text>
                <TouchableOpacity
                  style={estilos.produtosSectionButton}
                  onPress={() => navigation.navigate('TelaProdutos')}
                >
                  <Text style={estilos.produtosSectionButtonText}>Mais Jogos</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={jogos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// === ESTILOS ===
const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070707',
  },
  container: {
    flex: 1,
    backgroundColor: '#070707',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  backgroundShapeTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#7B121B',
    top: -140,
    right: -110,
    opacity: 0.9,
  },
  backgroundShapeMid: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#7B121B',
    left: -180,
    top: '50%',
    transform: [{ translateY: -160 }],
    opacity: 0.9,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#7B121B',
    bottom: -140,
    right: -110,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  rightTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBoxSmall: {
    backgroundColor: '#121212',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  userLabel: {
    color: '#8B8B8B',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userEmail: {
    color: '#ECECEC',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#A5151D',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  produtosSectionButton: {
    backgroundColor: '#A5151D',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  produtosSectionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 10,
  },
  logoPrincipal: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    color: '#ECECEC',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  subtitle: {
    color: '#BEBFC4',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  promoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#ECECEC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  sectionTitle2: {
    color: '#ECECEC',
    fontSize: 22,
    fontWeight: '700',
  },
  favoritosButton: {
    backgroundColor: '#A5151D',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  favoritosButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 10,
    paddingRight: 20,
    marginBottom: 35,
  },
  highlightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 160,
    padding: 8,
  },
  highlightImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  highlightName: {
    color: '#ECECEC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  highlightPrice: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagemContainer: {
    width: 150,
    height: 150,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 14,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
  },
  nome: {
    color: '#ECECEC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  precoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  descricao: {
    fontWeight: '700',
    color: '#4CAF50',
    fontSize: 18,
  },
  cardButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '15%',
  },
  favoriteButton: {
    marginLeft: 10,
  },
  favoriteBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  favoriteButtonPromo: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 28,
    height: 28,
  },
  favoriteBackgroundPromo: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
  },
  favoriteIconPromo: {
    fontSize: 24,
  },
  botaoInstalar: {
    backgroundColor: '#A5151D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  precoOriginal: {
    color: '#b40202',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  cardWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
});
