import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';


type HeaderProps = {
  navigation: any; // ou DrawerNavigationProp selon votre type de navigation
};

export default function Header({ navigation }: HeaderProps) {

  // Chargement des fonts ///
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/poppins/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  
  const { top } = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView>
    <View style={{ ...styles.container, top }}>
      <TouchableOpacity onPress={openDrawer} style={styles.buttonLeft}>
      <MaterialIcons name="menu" size={24} color="#EEEEEE" />
       
      </TouchableOpacity>
      <Text style={styles.title}>Framemento</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#050505',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingRight: 24,
    paddingLeft: 20,
  },
  buttonLeft: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderRadius: 16,
  },
  title: {
    color: '#EEEEEE',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 40,
  }

});


/*import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type HeaderProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>
};

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>
};


export default function Header({ navigation }: HeaderProps) {

  const { top } = useSafeAreaInsets(); // Composant reste en haut de l'écran (encart)

  return (
    <View style={{...styles.container, top}}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <FontAwesome name={'bars'} style={styles.bars} />
        <Text>Framemento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingLeft: 18,
    position: 'absolute'
  },
  bars: {
    fontSize: 30
  }
});*/