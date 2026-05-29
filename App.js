import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { autenticacao } from './config/firebaseConfig';
import { FavoritesProvider } from './context/FavoritesContext';
import TelaCadastro from './telas/TelaCadastro';
import TelaHome from './telas/TelaHome';
import TelaLogin from './telas/TelaLogin';
import TelaDetalheProduto from './telas/Teladetalheproduto';
import TelaFavoritos from './telas/Telafavoritos';

const Camadas = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const desinscrever = onAuthStateChanged(autenticacao, (usuarioAtual) => {
      setUsuario(usuarioAtual);
    });
    return desinscrever;
  }, []);

  return (
    <FavoritesProvider>
      <NavigationContainer>
      <Camadas.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#ECECEC',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: { backgroundColor: '#070707' },
        }}
      >
        {usuario ? (
          <>
            <Camadas.Screen name="Home" component={TelaHome} />
            <Camadas.Screen name="DetalheProduto" component={TelaDetalheProduto} />
            <Camadas.Screen name="Favoritos" component={TelaFavoritos} />
          </>
        ) : (
          <>
            <Camadas.Screen name="Login" component={TelaLogin} />
            <Camadas.Screen name="Cadastro" component={TelaCadastro} />
          </>
        )}
      </Camadas.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}