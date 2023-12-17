import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

/// REDUX PERSIST ///
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user'; 
//import AsyncStorage from '@react-native-async-storage/async-storage';


/// PERSITOR A FAIRE A LA FIN DU PROJET ? ///
//const reducers = combineReducers({ user });
//const persistConfig = { key: 'framemento', storage: AsyncStorage};

// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
//  });

// SANS PERSISTOR // 
const store = configureStore({
  reducer: { user },
 });


//const persistor = persistStore(store);

/// NAVIGATION ///
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator#installation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/// ECRANS ///
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import RollsScreen from './screens/RollsScreen';
import RollScreen from './screens/RollScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import MyMaterialScreen from './screens/MyMaterialScreen';
import CommunityProfileScreen from './screens/CommunityProfileScreen';

/// ICONS ///
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AppStack = createNativeStackNavigator();
const MyRollsStack = createNativeStackNavigator<RootStackParamList>();
const CommunityTopTab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/// COMPONENTS ///
import Header from './components/Header';

/// IMPORTS TYPES ///

import { RollType } from './types/roll';
import CommunitySearchScreen from './screens/CommunitySearchScreen';

export type RootStackParamList = {
  Rolls: undefined; // Autres écrans si nécessaire
  Roll: { roll: RollType };
};


const MyRollsStackNavigation = () => {
  /// navigation 
  return (
    <MyRollsStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Ecran qui présente toutes les pellicules */}
      <MyRollsStack.Screen name="Rolls" component={RollsScreen}/> 
      {/* Ecran ou MODALE ? ajouter / modifier une pellicule  */}
      {/* <MyRollsStack.Screen name="RollEdit" component={RollEditScreen}/> */}
      {/* Ecran qui présente toutes les photos de la pellicule sélectionnée */}
      <MyRollsStack.Screen name="Roll" component={RollScreen}/>
      {/* Ecran ou MODALE ? ajouter / modifier / consulter une photo  */}
      {/* Ecran qui présente toutes les photos de la pellicule sélectionnée */}
    </MyRollsStack.Navigator>
  )
}

const CommunityTopTabNavigation = () => {
  /// navigation 
  return (
      <CommunityTopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: '#fff', justifyContent: 'flex-end', flex: 0.28 }, // Style de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: '#007BFF' }, // Style de l'indicateur
        }}
      >
        <CommunityTopTab.Screen
          name="Profile"
          component={CommunityProfileScreen}
          options={{ tabBarLabel: 'Profil' }} // Options spécifiques à l'onglet
        />
        <CommunityTopTab.Screen
          name="Search"
          component={CommunitySearchScreen}
          options={{ tabBarLabel: 'Rechercher' }} // Options spécifiques à l'onglet
        />
      </CommunityTopTab.Navigator>
  )
}

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';
 
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Profile') {
          iconName = 'user';
        }
 
        return <FontAwesome name={iconName} size={size} color={color} />; // ATTENTION CHANGER LES ICONS
      },
      tabBarActiveTintColor: '#2196f3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>

      <Tab.Screen name="Mes pellicules" component={MyRollsStackNavigation} />
      <Tab.Screen name="Communauté" component={CommunityTopTabNavigation} />
    </Tab.Navigator>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Signin" screenOptions={{
      header: (props) => <Header {...props} />,
      drawerActiveTintColor: '#655074',
      drawerType: 'back',
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Drawer.Screen name="<- Retour" component={TabNavigator} />
      <Drawer.Screen name="Mon compte" component={MyAccountScreen} />
      <Drawer.Screen name="Mes appareils" component={MyMaterialScreen} />
    </Drawer.Navigator>
  );
};


 export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
          <AppStack.Screen name="Welcome" component={WelcomeScreen} />
          <AppStack.Screen name="Signup" component={SignupScreen} />
          <AppStack.Screen name="Signin" component={SigninScreen} />
          
          <AppStack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          {/* ... d'autres écrans */}
        </AppStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// export default function App() {
//   return (
//     <Provider store={store}>
//       {/* <PersistGate persistor={persistor}> */}
//           <NavigationContainer>
//             <AppStack.Navigator screenOptions={{ headerShown: false }}>
//               <AppStack.Screen name="Welcome" component={WelcomeScreen} />
//               <AppStack.Screen name="Signup" component={SignupScreen} />
//               <AppStack.Screen name="Signin" component={SigninScreen} />
//               {/* POUR DEV */}
//               <AppStack.Screen name="DrawerNavigator" component={DrawerNavigator} />
//               <AppStack.Screen name="Rolls" component={RollsScreen} /> 
//               <AppStack.Screen name="Roll" component={RollScreen} />
//               <AppStack.Screen name="TabNavigator" component={TabNavigator} />
//             </AppStack.Navigator>
//       </NavigationContainer>
//       {/* </PersistGate> */}
//     </Provider>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


/*

import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/drawer-navigator#installation

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{
      header: (props) => <Header {...props} />,
      drawerActiveTintColor: '#655074',
      drawerType: 'back',
      }}>
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="My recipes" component={MyRecipesScreen} />
    </Drawer.Navigator>
  );
};

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Recipe" component={RecipeScreen} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>

*/

