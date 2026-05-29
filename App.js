import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { autenticacao } from './config/firebaseConfig';
import { FavoritesProvider } from './context/FavoritesContext';

import TelaCadastro from './telas/TelaCadastro';
import TelaHome from './telas/TelaHome';
import TelaLogin from './telas/TelaLogin';
import TelaDetalheProduto from './telas/TelaDetalheProduto';
import TelaFavoritos from './telas/TelaFavoritos';

const Camadas = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: '#A5151D',
        tabBarInactiveTintColor: '#777',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'FavoritosTab') {
            iconName = 'favorite';
          }

          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={TelaHome}
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="FavoritosTab"
        component={TelaFavoritos}
        options={{
          title: 'Favoritos',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const desinscrever = onAuthStateChanged(
      autenticacao,
      (usuarioAtual) => {
        setUsuario(usuarioAtual);
      }
    );

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

            contentStyle: {
              backgroundColor: '#070707',
            },
          }}
        >
          {usuario ? (
            <>
              <Camadas.Screen
                name="Main"
                component={BottomTabs}
                options={{
                  headerShown: false,
                }}
              />

              <Camadas.Screen
                name="DetalheProduto"
                component={TelaDetalheProduto}
                options={{
                  title: 'Detalhes',
                }}
              />
            </>
          ) : (
            <>
              <Camadas.Screen
                name="Login"
                component={TelaLogin}
              />

              <Camadas.Screen
                name="Cadastro"
                component={TelaCadastro}
              />
            </>
          )}
        </Camadas.Navigator>

      </NavigationContainer>
    </FavoritesProvider>
  );
}