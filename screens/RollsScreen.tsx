import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import type { Dispatch } from '@reduxjs/toolkit';
import { UserState } from '../reducers/user';
import { addRoll, importRolls, removeRoll } from '../reducers/user';
import { RollType } from '../types/roll';

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


  /// SUPPRIMER UNE PELLICULE - BDD -> STORE -> ECRAN /// !! POUR LE DEV, A METTRE PLUTOT DANS ROLLSCREEN

  function handlePressOnTrash(rollId: string) {
    fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${rollId}`, { 
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }, 
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
          dispatch(removeRoll(rollId))
        }
    });
  }


  /// AFFICHER LES PELLICULES DU USER SUR L'ECRAN ///

  function handlePressOnRoll(roll: RollType): void {
    navigation.navigate('Roll', { roll });
  }

  const rollsList: JSX.Element[] = user.rolls?.map((data: RollType, i: number) => {
    return (
      <View key={i} style={styles.rollContainer}>
        <TouchableOpacity onPress={() => handlePressOnRoll(data)}>
          <View>
            <Text style={styles.rollName}>{data.name}</Text>
            <View style={styles.rollInfos}>
              <Text>{data.rollType}</Text>
              <Text>.</Text>
              <Text>{`${data.images}`}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePressOnTrash(data._id as string)}>
          <FontAwesome name='trash' />
        </TouchableOpacity>
      </View>
    )
  })


  return (
      <View style={styles.container}>
          {user.rolls.length === 0 && <Text>Ajoutez votre première pellicule</Text>}
          {rollsList}
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handlePressOnPlus}
          >
            <Text>+</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="fade" transparent>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>

                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    onPress={() => handlePressOnX()} 
                    style={styles.closeModalButton} 
                    activeOpacity={0.8}
                  >
                    <FontAwesome name='times' style={styles.closeModalIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textModalHeader}>Nouvelle pellicule</Text>
                </View>

                {/* Modal Text Inputs */}
                <View style={styles.textInputs1}>
                  <View style={styles.textInputTopContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Nom</Text>
                    </View>
                    <TextInput 
                    placeholder='-'
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    />
                  </View>
                  <View style={styles.textInputContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Type de film</Text>
                    </View>
                    <TextInput 
                    placeholder='-'
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={rollType}
                    onChangeText={(value) => setRollType(value)}
                    />
                  </View>
                  <View style={styles.textInputContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='hashtag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Nombre d'images</Text>
                    </View>
                    <TextInput 
                    placeholder="-"
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={`${Number(images)}`}
                    onChangeText={(value) => setImages(Number(value))}
                    />
                  </View>
                  <View style={styles.textInputBottomContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Push / Pull</Text>
                    </View>
                    <TextInput 
                    placeholder="-"
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={`${pushPull}`}
                    onChangeText={(value) => setPushPull(Number(value))}
                    />
                  </View>
                </View>

                <View style={styles.textInputs2}>
                  <Text style={styles.textCamera}>Appareil photo</Text>
                  <View style={styles.textInputTopContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Marque</Text>
                    </View>
                    <TextInput 
                    placeholder='-'
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={brand}
                    onChangeText={(value) => setBrand(value)}
                    />
                  </View>
                  <View style={styles.textInputBottomContainer}>
                    <View style={styles.textInputSubContainer}>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text style={styles.textTitle}>Modèle</Text>
                    </View>
                    <TextInput 
                    placeholder='-'
                    placeholderTextColor="#AAAAAA" 
                    style={styles.textInput}
                    value={model}
                    onChangeText={(value) => setModel(value)}
                    />
                  </View>
                </View>

                <View>
                  <TouchableOpacity 
                    style={styles.saveRollButton} 
                    activeOpacity={0.8}
                    onPress={handlePressOnSaveRoll}
                  >
                    <Text style={styles.saveRollText}>ENREGISTRER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    h1: {
      
    },
    button: {
      
    },
    centeredView: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center'
    },
    modalView: {

    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 52
    },
    closeModalButton: {
      backgroundColor: '#101010',
      justifyContent: 'center',
      alignItems: 'center',
      height: 48,
      width: 48,
      marginLeft: 20,
      borderRadius: 16
    },
    closeModalIcon: {
      color: '#EEEEEE',
      fontSize: 24,
    },
    textModalHeader: {
      color: '#EEEEEE',
      fontSize: 24,
      marginLeft: 15
    },
    textInputs1: {
      marginTop: 44,
    },
    textInputs2: {
      marginTop: 24,
    },
    textInputTopContainer: {
      backgroundColor: '#101010',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 48,
      width: 342,
      marginBottom: 1,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16
    },
    textInputContainer: {
      backgroundColor: '#101010',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 48,
      width: 342,
      marginBottom: 1
    },
    textInputBottomContainer: {
      backgroundColor: '#101010',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 48,
      width: 342,
      marginBottom: 1,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    },
    textInputSubContainer: {
      flexDirection: `row`,
      alignItems: 'center'
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
    textCamera: {
      color: '#AAAAAA',
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 12,
      marginTop: 10
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

    },
    rollName: {

    },
    rollInfos: {

    }
});