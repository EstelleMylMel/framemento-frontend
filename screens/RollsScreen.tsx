import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type RollsScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function RollsScreen({ navigation }: RollsScreenProps) {

  const [ modalVisible, setModalVisible ] = useState<Boolean>(false);
  const [ name, setName ] = useState<string>('');
  const [ rollType, setRollType ] = useState<string>('');
  const [ images, setImages ] = useState<string>('');
  const [ pushPull, setPushPull ] = useState<string>('');
  const [ brand, setBrand ] = useState<string>('');
  const [ model, setModel ] = useState<string>('');


  function handlePressOnPlus() {
    setModalVisible(true)
  }

  function handlePressOnX() {
    setModalVisible(false)
  }

  return (
      <View style={styles.container}>
          <Text>Ajoutez votre première pellicule</Text>
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
                  <TextInput 
                    placeholder='Nom'
                    style={styles.textInput}
                    value={name}
                    onChangeText={(value) => setName(value)}
                  >
                    <FontAwesome name='tag' style={styles.textInputIcon} />
                  </TextInput>
                  <TextInput 
                    placeholder='Type de film'
                    style={styles.textInput}
                    value={rollType}
                    onChangeText={(value) => setRollType(value)}
                  >
                    <FontAwesome name='ghost' style={styles.textInputIcon} />
                  </TextInput>
                  <TextInput 
                    placeholder="Nombre d'images"
                    style={styles.textInput}
                    value={images}
                    onChangeText={(value) => setImages(value)}
                  >
                    <FontAwesome name='hashtag' style={styles.textInputIcon} />
                  </TextInput>
                  <TextInput 
                    placeholder="Nombre d'images"
                    style={styles.textInput}
                    value={pushPull}
                    onChangeText={(value) => setPushPull(value)}
                  >
                    <FontAwesome name='ghost' style={styles.textInputIcon} />
                  </TextInput>
                </View>
                <View style={styles.textInputs2}>
                <TextInput 
                    placeholder='Marque'
                    style={styles.textInput}
                    value={brand}
                    onChangeText={(value) => setBrand(value)}
                  >
                    <FontAwesome name='ghost' style={styles.textInputIcon} />
                  </TextInput>
                  <TextInput 
                    placeholder='Modèle'
                    style={styles.textInput}
                    value={rollType}
                    onChangeText={(value) => setRollType(value)}
                  >
                    <FontAwesome name='ghost' style={styles.textInputIcon} />
                  </TextInput>
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


});