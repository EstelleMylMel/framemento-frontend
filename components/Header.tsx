import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';


type HeaderProps = {
  navigation: any,// ou DrawerNavigationProp selon votre type de navigation
  iconLeft: string,
  onPressLeftButton?: any,
  title: string,
  iconRight?: string,
  onPressRightButton?: any 
};

export default function Header({ navigation, iconLeft, onPressLeftButton, title, iconRight, onPressRightButton }: HeaderProps) {

  
  const { top } = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  
  const goBack = () => {
    navigation.goBack();
  }

  const openMoreOptions = (onPressRightButton: any) => {
    // notamment supprimer une pellicule

  }

  console.log(onPressLeftButton);

  return (
    <SafeAreaView>
    {/* <View style={{ ...styles.container, top }}> */}
      <View style={styles.container}>

      {/* menu drawer */}
      {iconLeft === 'menu' && (
        <>
          <TouchableOpacity onPress={openDrawer} style={styles.button}>
            <MaterialIcons name='menu' size={24} color="#EEEEEE" />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
        </>)
      }

      {/* back */}
      {iconLeft === 'arrow-back' && (
        <>
        <TouchableOpacity onPress={goBack} style={styles.button}>
          <MaterialIcons name='arrow-back' size={24} color="#EEEEEE" />
        </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </>)
      }

      {/* close */}
      {iconLeft === 'close' && (
        <>
        <TouchableOpacity onPress={onPressLeftButton} style={styles.button}>
          <MaterialIcons name='close' size={24} color="#EEEEEE" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        </>)
      }

      

      {/* more options*/}
      {iconRight && iconRight === 'more-vert' && (
        <>
        <TouchableOpacity onPress={() => openMoreOptions(onPressRightButton)} style={styles.button}>
          <MaterialIcons name='more-vert' size={24} color="#EEEEEE" />
        </TouchableOpacity> 
        </>)
      }

      {/* share */}
      {iconRight && iconRight === 'visibility' && (
        <>
        <TouchableOpacity onPress={onPressRightButton} style={styles.button}>
          <MaterialIcons name={iconRight? iconRight : ''} size={24} color="#FFDE67" />
        </TouchableOpacity>
        </>)}

      {/* share */}
      {iconRight && iconRight === 'visibility-off' && (
        <>
        <TouchableOpacity onPress={onPressRightButton} style={styles.button}>
          <MaterialIcons name={iconRight? iconRight : ''} size={24} color="#EEEEEE" />
        </TouchableOpacity>
        </>)}

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#050505',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingRight: 24,
    paddingLeft: 20,
    gap: 16,
    height: 88,
  },
  button: {
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