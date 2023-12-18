import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

/// REDUX PERSIST ///
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts } from 'expo-font';



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
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#fff', justifyContent: 'flex-end', flex: 0.3 }, // Style de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: '#007BFF' }, // Style de l'indicateur
        }}
      >
        <CommunityTopTab.Screen
          name="Profile"
          component={CommunityProfileScreen}
          options={{ tabBarLabel: 'Profile' }} // Options spécifiques à l'onglet
        />
        <CommunityTopTab.Screen
          name="Search"
          component={CommunitySearchScreen}
          options={{ tabBarLabel: 'Search' }} // Options spécifiques à l'onglet
        />
      </CommunityTopTab.Navigator>
  )
}

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color }) => {
        let iconName = '';
 
        if (route.name === 'Mes pellicules') {
          iconName = 'camera-roll';
        } else if (route.name === 'Communauté') {
          iconName = 'group-work';
        }
 
        const iconColor = focused ? '#EEEEEE' : '#777777';
        return <MaterialIcons name={iconName} size={24} color={iconColor}/>; // ATTENTION CHANGER LES ICONS
      },
      tabBarActiveTintColor: '#EEEEEE',
      tabBarInactiveTintColor: '#777777',
      tabBarStyle: {
        backgroundColor: '#101010',
        borderTopWidth: 0,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowColor: '#000000',
        borderRadius: 16, 
        paddingHorizontal: 8, 
        position: 'absolute', 
        bottom: 10, 
        left: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
      },
      tabBarLabel: ({ focused, color }) => (
        <Text style={{ 
          color : focused ?  '#EEEEEE' : '#777777',
          fontFamily: focused ? 'Poppins-Medium' : 'Poppins-Light',
          fontSize: 12,
        }}>
          {route.name}
        </Text>
      ),
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
      headerShown: false,
      //header: (props) => <Header {...props} />,
      drawerActiveTintColor: '#EEEEEE',
      drawerActiveBackgroundColor: '#050505',
      drawerInactiveTintColor: '#EEEEEE',
      drawerType: 'front',
      drawerStyle: {
        backgroundColor: '#050505',
        width: 240,
      },
    }}>
      <Drawer.Screen name="Main" component={TabNavigator} options={{
          drawerIcon: () => (
            <MaterialIcons name="account-circle" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 20 }}>
              Main
            </Text>
          )
        }}/>
      <Drawer.Screen name="Mon compte" component={MyAccountScreen} options={{
          drawerIcon: () => (
            <MaterialIcons name="account-circle" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 20 }}>
              Mon compte
            </Text>
          )
        }}/>
      <Drawer.Screen name="Mes appareils" component={MyMaterialScreen} options={{
          drawerIcon: () => (
            <MaterialIcons name="photo-camera" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 20 }}>
              Mes appareils
            </Text>
          )
        }}/>
    </Drawer.Navigator>
  );
};


 export default function App() {

  // Chargement des fonts ///
  const [fontsLoaded] = useFonts({
    'Poppins-Medium': require('./assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-Light': require('./assets/fonts/poppins/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/poppins/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

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

