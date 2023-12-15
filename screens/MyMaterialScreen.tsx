import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import CameraListScreen from './CameraListScreen';
import LensListScreen from './LensListScreen';

const Tab = createMaterialTopTabNavigator();

const MyMaterialScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#fff' }, // Style de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: '#007BFF' }, // Style de l'indicateur
        }}
      >
        <Tab.Screen
          name="Cameras"
          component={CameraListScreen}
          options={{ tabBarLabel: 'Cameras' }} // Options spécifiques à l'onglet
        />
        <Tab.Screen
          name="Lenses"
          component={LensListScreen}
          options={{ tabBarLabel: 'Lenses' }} // Options spécifiques à l'onglet
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyMaterialScreen;
