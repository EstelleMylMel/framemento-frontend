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
import Header from '../components/Header';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;


export default function CommunitySearchCategoryScreen({ navigation, route }: { navigation: any, route: any }) {

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [framesFromCategorySearched, setFramesFromCategorySearched] = useState<FrameType[]>([]);

  // const navigation: any = useNavigation();


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



  /* RECHERCHE PAR CATEGORIE */

  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/frames/search/${route.params.selectedCategory}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setFramesFromCategorySearched(data.frames);
            }
        })
        .catch(error => {
            console.error(`Error fetching frames shared from ${route.params.selectedCategory}:`, error);
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

  const framesFromCategorySearchedList = framesFromCategorySearched.map((frame: FrameType, i: number) => {

    // STYLE LIKE
    let isLikedByUserConnected = false;
    if (user.username) {
        frame.likes?.includes(user.username) ? isLikedByUserConnected = true : undefined;
    }
    let heartColor = isLikedByUserConnected ? "yellow" : "black";

    const date = new Date(frame.date);

    return (
      <View key={i} style={styles.frameSharedContainer}>
        <TouchableOpacity onPress={() => handlePressOnFrame(frame)}>
            <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={styles.argenticPhoto} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
            <Text style={styles.titleFrame}>{frame.location}</Text>
            <Text style={styles.infos}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} • ${frame.shutterSpeed} • ${frame.aperture}`}</Text>
        </View>

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
        <View style={styles.topContainer}>
          <View style={styles.subTopContainer}>
            <Text style={styles.profileText}>{route.params.selectedCategory}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={30} color="#EEEEEE" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>

        {/* All frames shared */}
        <ScrollView style={styles.scrollView}>
        { framesFromCategorySearchedList }
        { framesFromCategorySearched.length > 0 && framesFromCategorySearchedList }
        { framesFromCategorySearched.length === 0 && <Text style={{ color: '#EEEEEE', textAlign: 'center', marginTop: 200 }}>Aucune photo partagée dans cette catégorie.</Text>}
        </ScrollView>

        <View style={styles.centeredView}>
        <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
            <SafeAreaProvider>
                <View style={styles.modalView}>


                {/* Modal Header */}

                <Header navigation={navigation} iconLeft='close' title='Nom de la photo' onPressLeftButton={() => setModalViewFrameVisible(false)} />

            
                    <ScrollView style={styles.scrollViewModal}>
                    {/* Image de l'argentique */}
                        <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={styles.argenticPhoto} />
                    
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

            </SafeAreaProvider>
        </Modal>
        </View>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 25,
    width: '88%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subTopContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topContainerProfile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  topContainerText: {
    fontSize: 15,
    color: '#EEEEEE',
    fontFamily: 'Poppins-Medium',
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEEEEE'
  },
  noFrameText: {
    color: '#EEEEEE'
  },
  pickerContainer: {
    marginTop: 25,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: 'black',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItemTitle: {
    backgroundColor: 'black',
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Poppins-Light'
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
  },
  categories: {

  },
  category: {
    color: '#EEEEEE',
    fontSize: 12,
    fontFamily: 'Poppins-Light'
  },
  scrollView: {
    width: '100%',
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    gap: 24,
    marginTop: 10
  }, 
  scrollViewModal: {
    width: '100%',
    padding: 10,
    gap: 24,
    marginTop: 80,
    backgroundColor: '#050505'
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
    width: '100%',
    justifyContent: 'center',
    marginTop: 15
  },
  argenticPhoto: {
    height: 228,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  textContainer: {
    flex: 1,
    marginTop: 7
  },
  titleFrame: {
    color: '#EEEEEE',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Poppins-Medium'
  },
  infos: {
    flexDirection: 'row',
    color: '#AAAAAA',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    fontFamily: 'Poppins-Light'
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
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
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
    color: '#EEEEEE',
  },
});