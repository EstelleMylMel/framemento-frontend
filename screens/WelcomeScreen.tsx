import { View, ImageBackground, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';

/// COMPOSANTS ///
import CustomButton from '../components/CustomButton';

type WelcomeScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  
export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {

    const user = useSelector((state: { user: UserState }) => state.user.value)

    const handlePressSignup = () => {
      navigation.navigate('Signup')
    }

    const handlePressSignin = () => {
      navigation.navigate('Signin')
    }
    /// Redirection sur la page rolls si l'utilisateur est déjà connecté
    // useEffect(()=> {
    //   user.username !== '' ? navigation.navigate('Rolls') : undefined;
    // },[]);

    return (
        <View style={styles.container}>
          <ImageBackground 
              style={styles.backgroundImage} 
              resizeMode="cover" 
              source={require('../assets/background-image.jpg')} >
            <Text style={styles.h1}>Framemento</Text>
            {/*<TouchableOpacity style={styles.buttonSignup} onPress={()=> navigation.navigate('Signup')}>
              <Text style={styles.textSignup}>S'INSCRIRE</Text>
            {/*</TouchableOpacity>*/}
              <CustomButton
                title="S'inscrire"
                onPress={handlePressSignup}
                type='primary' />
            {/*<TouchableOpacity style={styles.buttonSignin} onPress={()=> navigation.navigate('Signin')}>
              <Text style={styles.textSignin}>SE CONNECTER</Text>
    </TouchableOpacity>*/}
                <CustomButton
                  title="Se connecter"
                  onPress={handlePressSignin}
                  type='secondary'/>
            <TouchableOpacity onPress={()=> navigation.navigate('MyMaterial')}>
              <Text style={styles.buttonTest}>DEV : MATERIAL</Text> 
            </TouchableOpacity>
          </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  },
  h1: {
    color: '#FFDE67',
    fontSize: 40,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 400, 
  },
  buttonTest: {
    color: '#FFDE67',
    marginTop: 20, 
  },
  buttonSignup: {
    backgroundColor: '#FFFF5B',
    width: 300,
    height: 45,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  textSignup: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  buttonSignin: {
    backgroundColor: '#1B1B1B',
    width: 300,
    height: 45,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  textSignin: {
    color: '#FFFF5B',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
});