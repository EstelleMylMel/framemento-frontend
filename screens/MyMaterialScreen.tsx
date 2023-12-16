import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CameraListScreen from './CameraListScreen';
import LensListScreen from './LensListScreen';



const Tab = createMaterialTopTabNavigator();


const MyMaterialScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mon Matériel</Text>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16, color: 'white' },
          tabBarStyle: { backgroundColor: '#0000' }, // Style de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: '#FFFF5B', width: 100, marginLeft: 55 }, // Style de l'indicateur
        }}
      >
        <Tab.Screen
          name="Cameras"
          component={CameraListScreen}
          options={{ tabBarLabel: 'Appareils' }} // Options spécifiques à l'onglet
        />
        <Tab.Screen
          name="Lenses"
          component={LensListScreen}
          options={{ tabBarLabel: 'Objectif' }} // Options spécifiques à l'onglet
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    },
  header: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginTop: 20,
    marginBottom: 20,
  }
});

export default MyMaterialScreen;
