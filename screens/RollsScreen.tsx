import { View, Text, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput, ScrollView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import type { Dispatch } from '@reduxjs/toolkit';
import { UserState } from '../reducers/user';
import { addRoll, importRolls, removeRoll } from '../reducers/user';
import { RollType } from '../types/roll';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type RollsScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function RollsScreen({ navigation }: RollsScreenProps) {


  const dispatch = useDispatch<Dispatch>();
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [ modalVisible, setModalVisible ] = useState<boolean>(false);
  const [ noRoll, setNoRoll ] = useState<boolean>(true);  // pour savoir si il y a au moins une pellicule stockée en BDD
  const [ name, setName ] = useState<string>('');
  const [ rollType, setRollType ] = useState<string>('');
  const [ images, setImages ] = useState<number | null>(null);
  const [ pushPull, setPushPull ] = useState<number>(0);
  const [ brand, setBrand ] = useState<string>('');
  const [ model, setModel ] = useState<string>('');


  /// STOCKER DANS LE STORE L'ENSEMBLE DES PELLICULES DU USER AU MONTAGE DU COMPOSANT - INUTILE CAR IMPORTER AU SIGNIN///
  // console.log(user.rolls)
 useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/users/${user.username}`)
    .then(response => response.json())
    .then(data => {
      if (!data.result) {
        setNoRoll(true);
      }
      else {
        setNoRoll(false);
        dispatch(importRolls(data.rolls));
      }
    })
  }, []);


  /// OUVRIR ET FERMER LA MODALE D'AJOUT DE PELLICULE ///

  function handlePressOnPlus() {
    setModalVisible(true)
  };

  function handlePressOnX() {
    setModalVisible(false)
  };


  /// AJOUTER UNE PELLICULE - BDD ROLLS -> BDD USERPROFILE -> STORE -> ECRAN ///

  function handlePressOnSaveRoll() {
    fetch(`${BACKEND_LOCAL_ADRESS}/rolls`, {
      method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ 
        name: name, 
        rollType: rollType, 
        images: images, 
        pushPull: pushPull,
        brand: brand,
        model: model,
        userId: user._id 
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(addRoll(data.newRoll));
        setName('');
        setRollType('');
        setImages(null);
        setPushPull(0);
        setModalVisible(false);
        console.log(user)
        console.log(user.rolls)
    });
  };


  /// AFFICHER LES PELLICULES DU USER SUR L'ECRAN ///

  function handlePressOnRoll(roll: RollType): void {
    navigation.navigate('Roll', { roll })
  }

  console.log('user rolls', user.rolls)

  const rollsList: JSX.Element[] = user.rolls?.map((data: RollType, i: number) => {
    return (
      <View key={i} style={styles.rollContainer}>
        <TouchableOpacity onPress={() => handlePressOnRoll(data)}>
          <View>
            <Text style={styles.rollName}>{data.name}</Text>
            <View style={styles.rollInfosContainer}>
              <Text style={styles.rollInfos} >{data.rollType}</Text>
              <Text style={styles.rollInfos}> • </Text>
              <Text style={styles.rollInfos}>{`${data.images}`}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handlePressOnTrash(data._id as string)}>
          <FontAwesome name='trash' />
        </TouchableOpacity> */}
      </View>
    )
  })

  console.log('rollList : ', user.rolls);

  console.log('user : ', user)


  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.headerContainer}>
        <Header navigation={navigation} iconLeft='menu' title='Framemento'/>
      </View>
      
      {/* AFFICAHGE DU MESSAGE */}
      { user.rolls.length === 0 && <Text style={styles.noRollText}>Ajoutez votre première pellicule</Text>}
      
      {/* OU DES PELLICULES */}
      { rollsList && <ScrollView style={styles.rollsContainer}>{rollsList}</ScrollView>}

      {/* BOUTON AJOUTER UNE PELLICULE */}
      <TouchableOpacity 
        style={styles.addRollButton} 
        activeOpacity={0.8}
        onPress={handlePressOnPlus}
      >
        <MaterialIcons name="add" size={40} color="#050505" style={{ borderRadius: 15 }}/>
      </TouchableOpacity>

      {/* MODALE AJOUTER UNE PELLICULE */}

      <View style={styles.centeredView}>
        <Modal visible={modalVisible} animationType="fade" transparent>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <View style={styles.modalView}>
                
                  {/* Modal Header */}
                  <Header navigation={navigation} iconLeft='close' onPressLeftButton={() => setModalVisible(false)} title='Nouvelle pellicule'/>

                  {/* Modal Text Inputs */}
                  <View style={styles.mainContent}>  
                    <View style={styles.form}>
                      <View style={styles.textInputs1}>

                        <CustomInput
                          label='Nom'
                          icon='local-offer'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={name}
                            onChangeText={(value) => setName(value)}
                            style={styles.input}
                            />
                        </CustomInput>
                        <CustomInput
                          label='Type de film'
                          icon='camera-roll'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={rollType}
                            onChangeText={(value) => setRollType(value)}
                            style={styles.input}
                            />
                        </CustomInput>
                        <CustomInput
                          label={`Nombre d'images`}
                          icon='tag'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={`${Number(images)}`}
                            onChangeText={(value) => setImages(Number(value))}
                            style={styles.input}
                            />
                        </CustomInput>
                        <CustomInput
                          label='Push / Pull'
                          icon='swap-vert'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={`${pushPull}`}
                            onChangeText={(value) => setPushPull(Number(value))}
                            style={styles.input}
                            />
                        </CustomInput>

                      </View>

                      <View style={styles.cameraInputsContainer}>
                        <Text style={styles.textCamera}>Appareil photo</Text>
                        <View style={styles.textInputs2}>

                        <CustomInput
                          label='Marque'
                          icon='photo-camera'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={brand}
                            onChangeText={(value) => setBrand(value)}
                            style={styles.input}
                            />
                        </CustomInput>
                        <CustomInput
                          label='Modèle'
                          icon='photo-camera'
                        >
                          <TextInput
                            placeholder='-'
                            placeholderTextColor='#AAAAAA'
                            value={model}
                            onChangeText={(value) => setModel(value)}
                            style={styles.input}
                            />
                        </CustomInput>
                      
                          
                          </View>
                      </View>

                    </View>

                    {/* Bouton enregistrer */}
                    <View style={styles.saveButtonContainer}>
                      <CustomButton
                        title='Enregistrer'
                        onPress={handlePressOnSaveRoll}
                        type='primary'
                        />
                    </View>
                  </View>

                </View>
            </KeyboardAvoidingView>
          {/* </SafeAreaProvider> */}
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    body: {
      height: '100%',
      width: '100%',
      flex: 1,
      backgroundColor: '#050505',
      alignItems: 'center',
    },
    headerContainer: {
      // height: 130,
      flex: 1,
      width: '100%',
    },
    noRollText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '500',
      textAlign: 'center',
      color: '#EEEEEE',
      marginTop: 350,
      width: 200
    },
    rollsContainer: {
      padding: 24,
      width: '100%',
      height: '80%',
      gap: 16,
      marginTop: 24
    },
    addRollButton: {
      height: 80,
      width: 80,
      backgroundColor: '#FFDE67',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      position: 'absolute',
      zIndex: 20,
      bottom: 110,
      right: 20,
    },
    centeredView: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
    },
    modalView: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      backgroundColor: '#050505'
    },
    mainContent: {
      flex: 7,
      padding: 24,
      marginTop: 100,
      gap: 24,
      height: '80%',
      justifyContent: 'space-between',
    },
    form: {
      gap: 24,
    },
    textInputs1: {
      
      borderRadius: 12,
      width: '100%',
    },
    textInputs2: {
      
    },
    input: {
      color: '#EEEEEE',
      fontSize: 14,
      fontFamily: 'Poppins-Light',
      fontStyle: 'normal',
      fontWeight: '300',
      lineHeight: 24,
      width: 150,
      textAlign: 'right',
    },
    textTitle: {
      color: '#AAAAAA',
      fontSize: 14
    },
    textInputIcon: {
      color: '#AAAAAA',
      fontSize: 20,
      marginLeft: 12,
      marginRight: 12
    },
    textInput: {
      color: '#AAAAAA',
      fontSize: 14,
      marginRight: 16
    },
    cameraInputsContainer: {
      gap: 8,

    },
    textCamera: {
      color: '#AAAAAA',
      textAlign: 'center',
      fontFamily: 'Poppins-Light',
      fontSize: 12,
    },
    saveRollButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      width: 350,
      backgroundColor: '#FFDE67',
      marginTop: 170
    },
    saveRollText: {
      color: '#050505'
    },
    rollContainer: {
      backgroundColor: '#101010',
      width: '100%',
      height: 80,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    rollName: {
      color: '#EEEEEE',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Poppins-Medium'
    },
    rollInfosContainer:{
      flexDirection: 'row',
    },
    rollInfos: {
      color: '#AAAAAA',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: '300',
      lineHeight: 24,
      fontFamily: 'Poppins-Light'
    },
    saveButtonContainer: {
    //   width: '100%',
    }
});