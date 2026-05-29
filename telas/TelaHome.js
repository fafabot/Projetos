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
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';
import { useFavorites } from '../context/FavoritesContext';

const tecnologias = [
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

export default function TelaHome() {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const fazerLogout = () => {
    signOut(autenticacao);
  };

  const renderItem = ({ item }) => (
    <View style={estilos.card}>
      <View style={estilos.cardLeft}>
        <View style={estilos.imagemContainer}>
          <Image
            source={item.imagem}
            style={estilos.logo}
            resizeMode="cover"
          />
        </View>

        <View style={estilos.info}>
          <Text style={estilos.nome}>
            {item.nome}
          </Text>


          <View style={estilos.precoContainer}>
            <Text style={estilos.precoOriginal}>
              {item.precoOriginal}
            </Text>
            <Text style={estilos.descricao}>
              {item.preco}
            </Text>
          </View>
          <View style={estilos.cardButtons}>
              <TouchableOpacity
                style={estilos.botaoInstalar}
                onPress={() =>
                  navigation.navigate('DetalheProduto', {
                    produto: item,
                  })
                }
              >
                <Text style={estilos.textoBotao}>
                  Ver Mais
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Text
                  style={[
                    estilos.favoriteIcon,
                    {
                      color: isFavorite(item.id)
                        ? '#E91E63'
                        : '#888',
                    },
                  ]}
                >
                  {isFavorite(item.id) ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#070707"
      />

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

            {/* TOPO */}
            <View style={estilos.topBar}>

            <View style={estilos.userBoxSmall}>
              <Text style={estilos.userLabel}>
                LOGADO COMO
              </Text>

              <Text style={estilos.userEmail}>
                {autenticacao.currentUser?.email}
              </Text>
            </View>

            <View style={estilos.rightTopBar}>

                <TouchableOpacity
                  style={estilos.logoutButton}
                  onPress={fazerLogout}
                >
                  <Text style={estilos.buttonText}>
                    Sair
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* HEADER */}
            <View style={estilos.headerCenter}>
              <Image
                source={require('../assets/logo.png')}
                style={estilos.logoPrincipal}
              />

              <Text style={estilos.title}>
                KEY FORGE
              </Text>

              <Text style={estilos.subtitle}>
                SUA BIBLIOTECA DE TECNOLOGIAS
              </Text>
            </View>

            {/* PROMOÇÕES */}
            <View style={estilos.promoHeaderRow}>
              <Text style={estilos.sectionTitle2}>
                Promoções Especiais
              </Text>

              <TouchableOpacity
                style={estilos.favoritosButton}
                onPress={() =>
                  navigation.navigate('FavoritosTab')
                }
              >
                <Text style={estilos.favoritosButtonText}>
                  Meus Favoritos
                </Text>
              </TouchableOpacity>
            </View>

            {/* CARDS PROMOÇÃO */}
            <View style={estilos.highlightRow}>
              {promocoesEspeciais.map((item) => (
                <View
                  style={estilos.highlightItem}
                  key={item.id}
                >
                  <TouchableOpacity
                    style={estilos.highlightCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate(
                        'DetalheProduto',
                        {
                          produto: item,
                        }
                      )
                    }
                  >
                    <Image
                      source={item.imagem}
                      style={estilos.highlightImage}
                      resizeMode="cover"
                    />

                    <Text style={estilos.highlightName}>
                      {item.nome}
                    </Text>

                    <Text style={estilos.highlightPrice}>
                      {item.preco}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* EM ALTA */}
            <Text style={estilos.sectionTitle}>
              Em Alta
            </Text>

            <FlatList
              data={tecnologias}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingBottom: 120,
              }}
            />

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 10
        : 10,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },

  homeText: {
    color: '#ECECEC',
    fontSize: 18,
    fontWeight: '700',
  },

  rightTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userBoxSmall: {
    backgroundColor: '#121212',
    borderRadius: 16,
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
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginLeft: 10,
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
    borderRadius: 14,
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
    marginBottom: 35,
    gap: 14,
  },

  highlightItem: {
    width: '35%',
  },

  highlightCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },

  highlightImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
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
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  imagemContainer: {
  width: 150,
  height: 150,
  borderRadius: 10,
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

  favoriteIcon: {
    fontSize: 32,
  },

  botaoInstalar: {
    backgroundColor: '#A5151D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
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
});