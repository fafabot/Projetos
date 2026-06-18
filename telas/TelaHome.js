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
    preco: 'R$ 49,90',
    descricao: 'Plataforma de ação com arte desenhada à mão.',
    imagem: require('../assets/imagemjogos/cuphead.jpg'),
  },
  {
    id: '2',
    nome: 'Assasins Creed Origins',
    preco: 'R$ 119,90',
    descricao: 'Açãoc e aventura no Egito antigo.',
    imagem: require('../assets/imagemjogos/assasins creed origins.jpg'),
  },
  {
    id: '3',
    nome: 'God of War Ragnarok',
    preco: 'R$ 249,90',
    descricao: 'Ação épica baseada na mitologia nórdica.',
    imagem: require('../assets/imagemjogos/god of war ragnarol.jpg'),
  },
  {
    id: '4',
    nome: 'Hollow Knight',
    preco: 'R$ 39,90',
    descricao: 'Exploração sombria em um mundo de insetos.',
    imagem: require('../assets/imagemjogos/hollow knight.jpg'),
  },
  {
    id: '5',
    nome: 'Red Dead Redemption 2',
    preco: 'R$ 149,90',
    descricao: 'Western em mundo aberto com história imersiva.',
    imagem: require('../assets/imagemjogos/red dead remdepmtion 2.jpg'),
  },
  {
    id: '6',
    nome: 'The Last of Us II',
    preco: 'R$ 199,90',
    descricao: 'Aventura emocional em um mundo pós-apocalíptico.',
    imagem: require('../assets/imagemjogos/the last of us II.jpg'),
  },
  {
    id: '7',
    nome: 'Resident Evil Biohazard',
    preco: 'R$ 179,90',
    descricao: 'Terror de sobrevivência com atmosfera tensa.',
    imagem: require('../assets/imagemjogos/resident Evil biogazard.jpg'),
  },
];

const promocoesEspeciais = [
  {
    id: 'p1',
    nome: 'GTA V',
    preco: 'R$ 79,90',
    descricao: 'Ação em mundo aberto e missões intensas.',
    imagem: require('../assets/imagemjogos/GTA V.jpg'),
  },
  {
    id: 'p2',
    nome: 'Minecraft',
    preco: 'R$ 59,90',
    descricao: 'Criação e sobrevivência em blocos.',
    imagem: require('../assets/imagemjogos/minecraft.jpg'),
  },
  {
    id: 'p3',
    nome: 'Elden Ring',
    preco: 'R$ 189,90',
    descricao: 'RPG de ação desafiador em mundo sombrio.',
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
        
        <Image
          source={item.imagem}
          style={estilos.logo}
          resizeMode="cover"
        />

        <View style={estilos.info}>
          <Text style={estilos.nome}>
            {item.nome}
          </Text>

          <Text style={estilos.descricao}>
            {item.preco}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={estilos.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={[estilos.favoriteIcon, { color: isFavorite(item.id) ? '#E91E63' : '#888' }]}> 
            {isFavorite(item.id) ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoInstalar}
          onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
        >
          <Text style={estilos.textoBotao}>
            Ver Mais
          </Text>
        </TouchableOpacity>
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
        <View style={estilos.backgroundShapeBottom} />

        <ScrollView
          style={estilos.scroll}
          contentContainerStyle={estilos.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <View style={estilos.content}>
            <View style={estilos.headerTop}>
              <View style={estilos.headerInfo}>
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

              <View style={estilos.headerRight}>
                <View style={estilos.userBoxSmall}>
                  <Text style={estilos.userLabel}>
                    LOGADO COMO
                  </Text>

                  <Text style={estilos.userEmail}>
                    { autenticacao.currentUser?.email}
                  </Text>
                </View>

                <TouchableOpacity
                  style={estilos.logoutButton}
                  onPress={fazerLogout}
                >
                  <Text style={estilos.buttonText}>
                    Sair da Conta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={estilos.promoHeaderRow}>
              <Text style={estilos.sectionTitle2}>Promoções Especiais</Text>
              <TouchableOpacity style={estilos.favoritosButton} onPress={() => navigation.navigate('Favoritos')}>
                <Text style={estilos.favoritosButtonText}>Meus Favoritos</Text>
              </TouchableOpacity>
            </View>

            <View style={estilos.highlightRow}>
              {promocoesEspeciais.map((item) => (
                <View style={estilos.highlightItem} key={item.id}>
                  <TouchableOpacity
                    style={estilos.highlightCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('DetalheProduto', { produto: item })}
                  >
                    <Image
                      source={item.imagem}
                      style={estilos.highlightImage}
                      resizeMode="cover"
                    />
                    <Text style={estilos.highlightName}>{item.nome}</Text>
                    <Text style={estilos.highlightPrice}>{item.preco}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

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
    width: '100%',
    backgroundColor: '#070707',
    overflow: 'hidden',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#070707',
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#070707',
  },

  backgroundShapeTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#7B121B',
    top: -120,
    right: -100,
    opacity: 0.9,
  },

  backgroundShapeBottom: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#2C0A0F',
    bottom: -150,
    left: -120,
    opacity: 0.9,
  },

  content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#070707',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 20
        : 20,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  headerInfo: {
    flex: 1,
    paddingRight: 12,
  },

  headerRight: {
    alignItems: 'flex-end',
    width: '36%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 0,
  },

  logoPrincipal: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    color: '#ECECEC',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },

  subtitle: {
    color: '#BEBFC4',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  userBox: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginBottom: 18,
  },

  userBoxSmall: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginRight: 12,
  },

  userLabel: {
    color: '#8B8B8B',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  userEmail: {
    color: '#ECECEC',
    fontSize: 16,
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#A5151D',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 5,
  },

  logoutButton: {
    backgroundColor: '#A5151D',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 120,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    marginBottom: 18,
    alignItems: 'center',
     justifyContent: 'center',
     textAlign: 'center',
  },

  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 68,
    height: 68,
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  highlightItem: {
    alignItems: 'center',
    width: '30%',
  },

  highlightCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7E7E7E',
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    overflow: 'hidden',
  },

  highlightImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },

  highlightName: {
     color: '#ECECEC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  highlightPrice: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  highlightText: {
    color: '#4CAF50',
    fontSize: 11,
    textAlign: 'center',
  },

  highlightTitle: {
    color: '#ECECEC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  nome: {
    color: '#ECECEC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  descricao: {
    color: '#4CAF50',
    fontSize: 13,
  },

  botaoInstalar: {
    backgroundColor: '#A5151D',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginLeft: 10,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 14,
  },
  favoriteButton: {
    marginRight: 10,
    padding: 6,
  },
  favoriteIcon: {
    fontSize: 32,
  },
  favoritosButton: {
    backgroundColor: '#A5151D',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  favoritosButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  promoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});