import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';

type HeaderProps = {
  navigation: any; // ou DrawerNavigationProp selon votre type de navigation
};

export default function Header({ navigation }: HeaderProps) {
  const { top } = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={{ ...styles.container, top }}>
      <TouchableOpacity onPress={openDrawer}>
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
    position: 'absolute',
  },
  bars: {
    fontSize: 30,
  },
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