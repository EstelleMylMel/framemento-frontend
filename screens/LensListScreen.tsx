// Importez les bibliothèques nécessaires de React
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Alert, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserState } from '../reducers/user';

// IMPORTS TYPES //
import { LensType } from '../types/lens';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type LensListScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

function LensListScreen({ navigation }: LensListScreenProps) {
 
  const user = useSelector((state: { user: UserState }) => state.user.value);
  
  const [userLenses, setUserLenses] = useState<LensType[]>([]);
  const [lenses, setLenses] = useState<LensType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  // fonctions permettant d'ajouter du texte dans les inputs
  const handleBrandChange = (text: string) => {
    setBrand(text);
  };
  
  const handleModelChange = (text: string) => {
    setModel(text);
  };


  // Effectuer une action après le rendu initial du composant
  useEffect(() => {
    // Requête à l'API pour récupérer la liste des objectifs
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${user._id}`)
      .then((response) => response.json()) 
      .then((data) => {
        if (data.result) {
          // Mettre à jour l'état local avec la liste des objectifs
          setUserLenses(data.lenses);
        }
      })
      .catch((error) => {
        // Gérer les erreurs en cas d'échec de la requête
        console.error('Error fetching lenses:', error);
      });
  }, [user._id]); // Utiliser une dépendance vide pour n'exécuter useEffect qu'une seule fois (après le rendu initial)

  
  const handleDeleteLens = (lensId: string) => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${lensId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setLenses((prevLenses) => prevLenses.filter((lens) => lens._id !== lensId));
        } else {
          console.error('Error deleting lens:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error deleting lens:', error);
      });

      setUserLenses((prevLenses) => prevLenses.filter((lens) => lens._id !== lensId));
  }


  // fonction permettant d'ajouter et enregistrer brand et model
  const handleSaveLens = () => {
  // actions pour réinitialiser les états
  setBrand('');
  setModel('');

  // Vérification que brand et model sont définis
  if (brand && model) {
    // requête pour sauvegarder l'objectif
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lenses/${user._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brand, model }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data && data.result) {
        // Mettre à jour l'état local des objectifs avec le nouvel objectif
        setLenses((prevLenses) => [...prevLenses, data.lens]);

        // Mettre à jour l'état local du UserProfile avec la nouvelle liste d'objectifs
        setUserLenses((prevUserLenses) => [...prevUserLenses, data.lens]);
      } else if (data && data.error) {
        console.error('Error saving lens1:', data.error);
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error saving lens2:', error);
    });
  } else {
    console.error('Brand or model is not defined');
  } 
};

  return (
    <View style={styles.lensContainer}>
          {userLenses.map((lens) => (
            <View key={lens._id} style={styles.lensItem}>
              <View style={styles.lensTextContainer}>
                <Text style={styles.textList}>{lens.brand}</Text>
                <Text style={styles.textList}>{lens.model}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteLens(lens._id)}>
                <FontAwesome name="trash" size={18} color="red" style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))}
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textAdd}>Nom de l'objectif</Text>
            <TextInput
              style={styles.input}
              placeholder="Marque"
              value={brand}
              onChangeText={handleBrandChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Modèle"
              value={model}
              onChangeText={handleModelChange}
            />
            <Pressable
              style={styles.buttonEnregistrer}
              onPress={() => {
                handleSaveLens(); // Appeler la fonction pour sauvegarder l'objectif
                setModalVisible(!modalVisible); // Cacher la modal
              }}
            >
              <Text style={styles.textButtonSave}>Enregistrer un objectif</Text>
            </Pressable>
            <Pressable
              style={styles.buttonAnnuler}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textButtonAnnuler}>Annuler</Text>
      </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.buttonAdd}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textButtonAdd}>Ajouter un objectif</Text>
      </Pressable>
      <Text style={styles.footer}>Framemento</Text>
    </View>
  );
}

export default LensListScreen;

const styles = StyleSheet.create({
  lensContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  lensItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1B1B1B',
    borderRadius: 2,
    width: 350,
    height: 70,
    paddingRight: 20,
    paddingLeft: 20,
  },
  lensTextContainer: {
    flex: 1,
  },
  textList: {
    color: 'white',
    fontSize: 16,
  },
  deleteIcon: {
    marginLeft: 10,
    color: 'white',
  },
  modal: {
    
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 350,
    height: 270,
    padding: 32,
    backgroundColor: '#000000',
    borderRadius: 16,
    borderColor: 'white', // Couleur du contour
    borderWidth: 0.5, // Largeur du contour
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  textAdd: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1B1B1B',
    width: 320,
    height: 40,
    paddingLeft: 10,
    marginTop: -20,
    color: 'white',
  },
  modalText: {
    // Vos styles pour le texte modal
  },
  button: {
    // Vos styles pour les boutons
  },
  buttonEnregistrer: {
    backgroundColor: '#FFFF5B',
    width: 320,
    height: 40,
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 6, 
    paddingBottom: 6,
    borderRadius: 12, 
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  buttonAnnuler: {
    backgroundColor: '#1B1B1B',
    width: 320,
    height: 40,
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 6, 
    paddingBottom: 6,
    borderRadius: 12, 
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -20,
  },
  textStyle: {
    color: 'white',  
  },
  buttonAdd: {
    backgroundColor: '#FFFF5B',
    width: 320,
    height: 40,
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 6, 
    paddingBottom: 6,
    borderRadius: 12, 
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10,
    position: 'absolute', // Ajout de la propriété position absolute
    bottom: 75, // Ajustez la distance depuis le bas selon vos besoins
    left: '50%', // Centre le bouton horizontalement
    transform: [{ translateX: -150 }], // Ajustez la moitié de la largeur du bouton pour le centrer
  },
  textButtonAdd: {
    color: '#1B1B1B',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  textButtonSave: {
    color: '#1B1B1B',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  textButtonAnnuler: {
    color: '#FFFF5B',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  footer: {
    color: 'white', 
    fontSize: 24,
    fontFamily: 'Poppins',
    fontWeight: '600', 
    position: 'absolute', // Ajout de la propriété position absolute
    bottom: 15, // Ajustez la distance depuis le bas selon vos besoins
  }
});
