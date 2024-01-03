import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

/// REDUX PERSIST ///
// import { persistStore, persistReducer } from 'redux-persist';
// import { PersistGate } from 'redux-persist/integration/react';
// import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts } from 'expo-font';


/// PERSITOR A FAIRE A LA FIN DU PROJET => PAS TERMINE ///
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
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
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
const CommunitySearchStack = createNativeStackNavigator();

/// COMPONENTS ///
import Header from './components/Header';

/// IMPORTS TYPES ///

import { RollType } from './types/roll';
import CommunitySearchScreen from './screens/CommunitySearchScreen';
import CommunitySearchUsernameScreen from './screens/CommunitySearchUsernameScreen';
import CommunitySearchCategoryScreen from './screens/CommunitySearchCategoryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Rolls: undefined; // Autres écrans si nécessaire
  Roll: { roll: RollType };
};


const MyRollsStackNavigation = () => {
  return (
    <MyRollsStack.Navigator screenOptions={{ headerShown: false }}>
      
      <MyRollsStack.Screen name="Rolls" component={RollsScreen}/> 
      
      <MyRollsStack.Screen name="Roll" component={RollScreen}/>
      
    </MyRollsStack.Navigator>
  )
}

const CommunitySearchStackNavigation = () => {
  return (
    <CommunitySearchStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunitySearchStack.Screen name="CommunitySearch" component={CommunitySearchScreen}/>
      <CommunitySearchStack.Screen name="CommunitySearchUsername" component={CommunitySearchUsernameScreen}/>
      <CommunitySearchStack.Screen name="CommunitySearchCategory" component={CommunitySearchCategoryScreen}/>
    </CommunitySearchStack.Navigator>
  )
}

// Typage du contenu des paramètres de la route
type TopTabNavigationProps = {
  navigation: NavigationProp<RootStackParamList>,
};

const CommunityTopTabNavigation: React.FC<TopTabNavigationProps> = ({navigation}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <Header navigation={navigation} iconLeft='menu' title='Framemento' marginTop={33} />
      <CommunityTopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, color: '#EEEEEE', fontFamily: 'Poppins-SemiBold', fontWeight: '600' },
          tabBarStyle: { backgroundColor: '#050505', justifyContent: 'flex-end', flex: 0.10, marginTop: 85 }, // Style de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: '#FFDE67'} // Style de l'indicateur
        }}
      >
        <CommunityTopTab.Screen
          name="Profile"
          component={CommunityProfileScreen}
          options={{ tabBarLabel: 'Profil' }}
        />
        <CommunityTopTab.Screen
          name="Search"
          component={CommunitySearchStackNavigation}
          options={{ tabBarLabel: 'Rechercher' }}
        />
      </CommunityTopTab.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
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
        return <MaterialIcons name={iconName} size={24} color={iconColor} style={{ marginBottom: -10 }}/>;
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
        position: 'absolute', 
        zIndex: 0, 
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,
      },
      tabBarLabel: ({ focused, color }) => (
        <Text style={{ 
          color : focused ?  '#EEEEEE' : '#777777',
          fontFamily: focused ? 'Poppins-Medium' : 'Poppins-Light',
          fontSize: 12,
          marginBottom: 10
        }}>
          {route.name}
        </Text>
      ),
      headerShown: false,
    })}>

      <Tab.Screen name="Mes pellicules" component={MyRollsStackNavigation}/>
      <Tab.Screen name="Communauté" component={CommunityTopTabNavigation} />
    </Tab.Navigator>
  );
}



const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Signin" screenOptions={{
      headerShown: false,
      drawerActiveTintColor: '#EEEEEE',
      drawerActiveBackgroundColor: '#050505',
      drawerInactiveTintColor: '#EEEEEE',
      drawerType: 'front',
      drawerStyle: {
        backgroundColor: '#050505',
        width: 240,
        paddingTop: 10,
      },
    }}>
      <Drawer.Screen name="Retour" component={TabNavigator} options={{
          drawerIcon: () => (
            <MaterialIcons name="arrow-back" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 16 }}>
              Retour
            </Text>
          )
        }}/>
      <Drawer.Screen name="Mon compte" component={MyAccountScreen} options={{
          drawerIcon: () => (
            <MaterialIcons name="account-circle" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 16 }}>
              Mon compte
            </Text>
          )
        }}/>
      <Drawer.Screen name="Mes appareils" component={MyMaterialScreen} options={{
          drawerIcon: () => (
            <MaterialIcons name="photo-camera" color='#EEEEEE' size={24} />
          ),
          drawerLabel: () => (
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#EEEEEE', fontSize: 16 }}>
              Mon matériel
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
          <AppStack.Screen name="MyMaterial" component={MyMaterialScreen} />
          
        </AppStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

