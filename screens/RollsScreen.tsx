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
  const [ images, setImages ] = useState<string>('');
  const [ pushPull, setPushPull ] = useState<string>('');
  const [ brand, setBrand ] = useState<string>('');
  const [ model, setModel ] = useState<string>('');


  /// STOCKER DANS LE STORE L'ENSEMBLE DES PELLICULES DU USER  AU MONTAGE DU COMPOSANT ///

  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/rolls`)
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


  /// AFFICHER LES PELLICULES DU USER SUR L'ECRAN ///

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

  const rollsList: JSX.Element[] = user.rolls.map((data: RollType, i: number) => {
    return (
      <View key={i} style={styles.rollContainer}>
        <View>
          <Text style={styles.rollName}>{data.name}</Text>
          <View style={styles.rollInfos}>
            <Text>{data.rollType}</Text>
            <Text>.</Text>
            <Text>{`${data.images}`}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handlePressOnTrash(data._id as string)}>
          <FontAwesome name='o-trash' />
        </TouchableOpacity>
      </View>
    )
  })


  /// OUVRIR ET FERMER LA MODALE D'AJOUT DE PELLICULE ///

  function handlePressOnPlus() {
    setModalVisible(true)
  };

  function handlePressOnX() {
    setModalVisible(false)
  };

  function handlePressOnEnregistrer() {
    // fetch POST /rolls (enregistre dans la collection rolls)
    // .then(data) -> fetch POST /users/rolls (body: username: user.username du store et _id: data._id id du roll enregistré)
    // addRoll to store
    setModalVisible(false)
  };


  return (
      <View style={styles.container}>
          {noRoll && <Text>Ajoutez votre première pellicule</Text>}
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
                    <FontAwesome name='xmark' style={styles.closeModalIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textModalHeader}>Nouvelle pellicule</Text>
                </View>

                {/* Modal Text Inputs */}
                <View style={styles.textInputs1}>
                  <View>
                    <View>
                      <FontAwesome name='tag' style={styles.textInputIcon} />
                      <Text>Nom</Text>
                    </View>
                    <TextInput 
                    placeholder='Nom'
                    style={styles.textInput}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    />
                  </View>
                  <View>
                    <View>
                      <FontAwesome name='ghost' style={styles.textInputIcon} />
                      <Text>Type de film</Text>
                    </View>
                    <TextInput 
                    placeholder='Type de film'
                    style={styles.textInput}
                    value={rollType}
                    onChangeText={(value) => setRollType(value)}
                    />
                  </View>
                  <View>
                    <View>
                      <FontAwesome name='hashtag' style={styles.textInputIcon} />
                      <Text>Nombre d'images</Text>
                    </View>
                    <TextInput 
                    placeholder="Nombre d'images"
                    style={styles.textInput}
                    value={images}
                    onChangeText={(value) => setImages(value)}
                    />
                  </View>
                  <View>
                    <View>
                      <FontAwesome name='ghost' style={styles.textInputIcon} />
                      <Text>Push / Pull</Text>
                    </View>
                    <TextInput 
                    placeholder="Nombre d'images"
                    style={styles.textInput}
                    value={pushPull}
                    onChangeText={(value) => setPushPull(value)}
                    />
                  </View>
                </View>

                <View style={styles.textInputs2}>
                  <Text>Appareil photo :</Text>
                  <View>
                    <View>
                      <FontAwesome name='ghost' style={styles.textInputIcon} />
                      <Text>Marque</Text>
                    </View>
                    <TextInput 
                    placeholder='Marque'
                    style={styles.textInput}
                    value={brand}
                    onChangeText={(value) => setBrand(value)}
                    />
                  </View>
                  <View>
                    <View>
                      <FontAwesome name='ghost' style={styles.textInputIcon} />
                      <Text>Modèle</Text>
                    </View>
                    <TextInput 
                    placeholder='Modèle'
                    style={styles.textInput}
                    value={model}
                    onChangeText={(value) => setModel(value)}
                    />
                  </View>
                </View>

                <View>
                  <TouchableOpacity 
                    style={styles.enregistrerButton} 
                    activeOpacity={0.8}
                    onPress={handlePressOnEnregistrer}
                  >
                    <Text>ENREGISTRER</Text>
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

    },
    modalView: {

    },
    modalHeader: {

    },
    closeModalButton: {

    },
    closeModalIcon: {

    },
    textModalHeader: {

    },
    textInputs1: {

    },
    textInputs2: {

    },
    textInputIcon: {

    },
    textInput: {
      
    },
    enregistrerButton: {

    },
    rollContainer: {

    },
    rollName: {

    },
    rollInfos: {

    }
});