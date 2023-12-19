import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView  } from 'react-native';
import { useSelector } from 'react-redux';
import { FrameType } from '../types/frame';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserState } from '../reducers/user';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import CustomField from '../components/CustomField';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;


export default function CommunitySearchUsernameScreen({ route }: { route: any }) {

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [framesFromUserSearched, setFramesFromUserSearched] = useState<FrameType[]>([]);

  const navigation: any = useNavigation();


  /// GÉRER LE LIKE - UNLIKE ///

  function handlePressOnHeart(frame: FrameType) {
    if (user.username) {
        if (!frame.likes?.includes(user.username)) {
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}/like`, {
                method: 'PUT',
                body: JSON.stringify({ username: user.username }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log("Frame liked successfully")
                }
            })
            .catch(error => {
                console.error('Error liking frame:', error);
            });
        }
        else {
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}/unlike`, {
                method: 'PUT',
                body: JSON.stringify({ username: user.username }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log("Frame unliked successfully")
                }
            })
            .catch(error => {
                console.error('Error unliking tweet:', error);
            });
        }
    }
  }



  /* RECHERCHE PAR USERNAME */

  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/users/search/${route.params.searchText}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setFramesFromUserSearched(data.framesShared);
            }
        })
        .catch(error => {
            console.error(`Error fetching frames shared from ${route.params.searchText}:`, error);
        });
  }, []);



  /// AFFICHER LES FRAMES PARTAGÉES À L'ARRIVÉE SUR L'ÉCRAN ///

    const [ modalViewFrameVisible, setModalViewFrameVisible ] = useState<boolean>(false);
    const [ frameToDisplay, setFrameToDisplay ] = useState<FrameType | undefined>();

    function handlePressOnFrame(frame: FrameType): void {
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}`)
            .then(response => response.json())
            .then(data => {
                setFrameToDisplay(data.frame);
            })
            .catch(error => {
              console.error('Erreur lors du fetch frame cliquée :', error);
            });
        setModalViewFrameVisible(true)
    }

  const framesFromUserSearchedList = framesFromUserSearched.map((frame: FrameType, i: number) => {

    // STYLE LIKE
    let isLikedByUserConnected = false;
    if (user.username) {
        frame.likes?.includes(user.username) ? isLikedByUserConnected = true : undefined;
    }
    let heartColor = isLikedByUserConnected ? "yellow" : "black";

    return (
      <View key={i} style={styles.frameSharedContainer}>
        <TouchableOpacity onPress={() => handlePressOnFrame(frame)}>
            <Image source={require("../assets/favicon.png")} style={styles.argenticPhoto} />
        </TouchableOpacity>
        <Text>{frame.location}</Text>

        <View style={styles.iconsContainer}>
            { /* Likes */ }
            { /* <TouchableOpacity onPress={() => handlePressOnHeart(frame)} >
                <MaterialIcons name='favorite' color={`${heartColor}`} style={styles.heartIcon} />
            </TouchableOpacity>
            <Text style={styles.likeCount}>{frame.likes?.length}</Text> */}
            { /* Commentaries */ }
            {/* <FontAwesome name='tag' style={styles.commentaryIcon} />
            <Text style={styles.commentaryCount}>{frame.commentaries?.length}</Text> */}
        </View>
      </View>
    )
  })


  return (
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
            <Image source={require("../assets/image-profil.jpg")} style={styles.profilePicture} />
            <Text style={styles.profileText}>{route.params.searchText}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerText}>Retour</Text>
            </TouchableOpacity>
        </View>

        {/* All frames shared */}
        <ScrollView>
        { framesFromUserSearchedList }
        </ScrollView>

        <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
            <SafeAreaProvider>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>


                {/* Modal Header */}
                <SafeAreaView style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setModalViewFrameVisible(false)} style={styles.headerButton} activeOpacity={0.8}>
                        <MaterialIcons name="close" size={24} color="#EEEEEE" />
                    </TouchableOpacity>
                    <Text style={styles.title}>TO CHANGE !!!</Text>
                    <Text style={styles.title}>{route.params.searchText}</Text>
                </SafeAreaView>
            

                    <ScrollView style={styles.scrollView}>
                    {/* Image de l'argentique */}
                        <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={{ width: 200, height: 200 }} />
                    
                    {/* numero photo / vitesse / ouverture */}
                    <View style={styles.fieldsGroup}>
                        {/* lieu */}
                        <CustomField label='Lieu' icon='location-on' value={frameToDisplay?.location}></CustomField>

                        {/* date */}
                        <CustomField label='Date' icon='date-range' value={String(frameToDisplay?.date)}></CustomField>

                        {/* meteo */}
                        <CustomField label='Weather' icon='cloud' value={frameToDisplay?.weather}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* appareil */}
                        <CustomField label='Appareil' icon='photo-camera' value={`${frameToDisplay?.camera.brand} - ${frameToDisplay?.camera.model}`}></CustomField>

                        {/* objectif */}
                        <CustomField label='Objectif' icon='circle' value={`${frameToDisplay?.lens?.brand} - ${frameToDisplay?.lens?.model}`}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* ouverture */}
                        <CustomField label='Ouverture' icon='photo-camera' value={frameToDisplay?.aperture}></CustomField>

                        {/* vitesse d'obturation */}
                        <CustomField label="Vitesse d'obturation" icon='circle' value={frameToDisplay?.shutterSpeed}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* nom */}
                        <CustomField label='Nom' icon='local-offer' value={frameToDisplay?.title}></CustomField>

                        {/* commentaire */}
                        <CustomField label='Commentaire' icon='notes' value={frameToDisplay?.comment}></CustomField>
                    </View>

                    {/* photo du téléphone */}
                    <Image source={{ uri: frameToDisplay?.phonePhoto }} style={styles.photoFromPhone} />
                    

                    </ScrollView>

                </View>

                </View>
            </SafeAreaProvider>
        </Modal>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePicture: {
    height: 60,
    width: 60
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerText: {

  },
  searchText: {
    fontSize: 14,
    color: 'black'
  },
  searchInput: {

  },
  scrollView: {

  },
  fieldsGroup: {
    width: 370,
    height: 'auto',
    borderRadius: 12,
    gap: -1,
    borderColor: '#222222',
    borderWidth: 0.5,
  },
  photoFromPhone: {

  },
  frameSharedContainer: {

  },
  argenticPhoto: {

  },
  iconsContainer: {

  },
  heartIcon: {

  },
  likeCount: {

  },
  commentaryIcon: {

  },
  commentaryCount: {

  },
  centeredView: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  modalView: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
  },
  headerButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderRadius: 16,
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
  title: {
    color: '#EEEEEE'
  }
});