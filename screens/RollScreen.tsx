import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { NavigationProp, ParamListBase, useRoute, RouteProp} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import { useDispatch } from 'react-redux';
import { removeRoll } from '../reducers/user';

// IMPORTS TYPES //
import { RollType } from '../types/roll';
import { CamType } from '../types/camera';
import { LensType } from '../types/lens';
import { UserState } from '../reducers/user';
import { FrameType } from '../types/frame';
import { RootStackParamList } from '../App';


//IMPORTS COMPOSANTS CUSTOM //
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { current } from '@reduxjs/toolkit';
import CustomField from '../components/CustomField';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { isLoading } from 'expo-font';
import ContextMenu from '../components/ContextMenu';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

// Typage du contenu des paramètres de la route
type RollScreenProps = {
    navigation: NavigationProp<RootStackParamList>,
    route: RouteProp<RootStackParamList, 'Roll'>
  };

//  export default function RollScreen({ navigation, route: { params: { roll }} }: RollScreenProps) {
  const RollScreen: React.FC<RollScreenProps> = ({ navigation, route }) => {
    
    const user = useSelector((state: { user: UserState }) => state.user.value);
    const dispatch = useDispatch();

    // Récupération des informations de la pellicule
    const { roll } = route.params;

    /// EXPO CAMERA ///
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    let cameraRef: any = useRef(null);

    /// ON/OFF MODALES ///
    const [ modalAddFrameVisible, setModalAddFrameVisible ] = useState<boolean>(false);
    const [ datepickerVisible, setDatepickerVisible ] = useState<boolean>(false);

    const [ modalViewFrameVisible, setModalViewFrameVisible ] = useState<boolean>(false);
    const [ frameToDisplay, setFrameToDisplay ] = useState<FrameType | undefined>();

    const [ modalTakePictureVisible, setModalTakePictureVisible ] = useState<boolean>(false);
    const [ requestCamera, setRequestCamera ] = useState<boolean>(false);

    const [ contextMenuVisible, setContextualMenuVisible ] = useState<boolean>(false);

    // const [ modalTest, setModalTest ] = useState<boolean>(true)

    /// ROLL AND FRAMES DATA ///
    const [ rollData, setRollData ] = useState<RollType | undefined>();
    const [ framesData, setFramesData ] = useState<FrameType[] | undefined>(); // à chaque ajout de photo on ajoute 1 dans ce tableau.
    const [ previousFrame, setPreviousFrame ] = useState<FrameType | undefined>(framesData && framesData.length > 0 ? framesData[framesData?.length - 1] :  undefined);

    //console.log("framesData", framesData)

    /// ATTENDRE QUE LES IMAGES CHARGENT AVANT D'AFFICHER ///
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(()=> {
      
      framesData? setIsLoading(false) : undefined;

    },[framesData]);


    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [ currentAdress, setCurrentAdress ] = useState<string>('');

    /// INPUTS VARIABLES & FONCTIONS ///


    /// Gérer l'incrémentation irrégulière du slider speed
    const [ frameSpeed, setFrameSpeed ] = useState<string | undefined >(previousFrame? previousFrame.shutterSpeed : '1/4000');
    
    /// Définir les valeurs du slider ///
    const shutterSpeeds = [4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];

    const [lastFrameSpeedValue, setLastFrameSpeedValue ] = useState<number>(0);


    const [ frameAperture, setFrameAperture] = useState<string | undefined >(previousFrame? previousFrame.aperture : 'f/4');

    const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

    const [lastFrameApertureValue, setLastFrameApertureValue ] = useState<number>(0);

    const [location, setLocation] = useState({latitude: 0,
      longitude: 0,
      adress: currentAdress
    });
    const handleChangeLocation = (text: string) => {  
      
      const customLocation = {
        latitude: 0,
        longitude: 0,
        adress: text
      }

      setLocation(customLocation);
    };

    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleChangeDate = (): void => {

        setDatepickerVisible(true);

    };

    const [weather, setWeather] = useState<string>('');
    const handleChangeWeather = (text: string): void => {
      setWeather(text);
    }
    const [camera, setCamera] = useState<CamType | undefined>();
    const [ lensBrand, setLensBrand ] = useState<string| undefined>(previousFrame ? previousFrame.lens?.brand : undefined);
    const [ lensModel, setLensModel ] = useState<string| undefined>(previousFrame ? previousFrame.lens?.model : undefined);

    const [ title, setTitle ] = useState<string>('');
    const [ commentary, setCommentary ] = useState<string>('');

    const [ urlPhotoFromPhone, setUrlPhotoFromPhone ] = useState<string>('');



    useEffect(()=>{

        /// Récuper le contenu de la pellicule
        fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${roll._id}`)
        .then(response => response.json())
        .then(rollData => {
            if (rollData.result) {
              
                setRollData(rollData.roll);
                rollData !== undefined ? setFramesData(rollData.framesList) : undefined;
                setIsLoading(false); // Laisser le temps à la requête de répondre avant d'afficher

              // fetch(`${BACKEND_LOCAL_ADRESS}/material/cameras/${rollData.roll.camera}`)  //${rollData.roll.camera} 
              fetch(`${BACKEND_LOCAL_ADRESS}/material/cameras/${rollData.roll.camera._id}/`)
              .then(response => response.json())
              .then(cameraData => {
                cameraData? setCamera(cameraData.camera) : console.log('no data : ', cameraData)
              })
              .catch(error => {
                console.error('Erreur lors du fetch camera :', error);
              });

            } else console.log('no data : ', rollData);

        })
        .catch(error => {
            console.error('Erreur lors du fetch de la pellicule :', error);
          });


    },[])

    // Remplir framesData des frames existantes dans la roll en cours

    useEffect(() => {
      fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${roll._id}`)
      .then(response => response.json())
      .then(data => {
        data.result && (setFramesData(data.frames), setPreviousFrame(data.frames ? data.frames[data.frames.length -1] : {}))

      /// INITIALISER LES SLIDERS A LA BONNE POSITION : EN COURS //

      // setLastFrameSpeedValue(shutterSpeeds.findIndex((speed)=> speed == 1/Number(frameSpeed)));
      // setLastFrameApertureValue(apertures.findIndex((aperture)=> `f/${aperture}` == frameAperture));

      })
    }, []);


    function handlePressOnPlus(): void {

        /// geoloc & date actuelles ///
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status === 'granted') {
            Location.watchPositionAsync({ distanceInterval: 10 },
              (location) => {
                setLatitude(location.coords.latitude);
                setLongitude(location.coords.longitude);

                // Attendre que l'API réponde pour ouvrir la modale pour éviter le lieu undefined
                setTimeout(()=> setModalAddFrameVisible(true), 2000);

              });
          }
        })();

        /// Obtenir l'adresse à partir des données de geoloc
        fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then((data)=> {
          setCurrentAdress(`${data.address.road}, ${data.address.city}`)
        })
        .catch(error => {
          console.error('Erreur lors du fetch api data gouv :', error);
        });

        /// Obtenir la météo actuelle
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/weather/${latitude}/${longitude}`)
        .then(response => response.json())
				.then(data => {
            setWeather(data.weather);
        })
        .catch(error => {
          console.error('Erreur lors du fetch api weather app :', error);
        });

        console.log('frames dans le roll ?  : ',roll.framesList?.length);
        //Récupérer les informations de la frame précédente
        if (roll.framesList?.length) {

          const lastFrameID = previousFrame?._id;
          console.log('lastFrame ID : ',lastFrameID);

          fetch(`${BACKEND_LOCAL_ADRESS}/frames/${lastFrameID}`)
          .then(response => response.json())
          .then(data => {
              setLensBrand(data.frame.lens.brand);
              setLensModel(data.frame.lens.model);
              setFrameAperture(data.frame.aperture);
              setFrameSpeed(data.frame.shutterSpeed);
          })
          .catch(error => {
            console.error('Erreur lors du fetch last frame :', error);
          });
        }

    };

    console.log('lastFrame', previousFrame);

    /// CAROUSEL DE NUMEROS DE PHOTO ///

    /* CREER LA LISTE DE NUMEROS */
    const [firstNum, setFirstNum] = useState<number>(1);
    const [numeros, setNumeros] = useState<number[]>([]);
    const [frameNumber, setFrameNumber] = useState<number | undefined >(previousFrame?.numero ? previousFrame.numero +1 : 1);

    function listOfNums(firstNum: number | undefined, lastNum: number) {
      const tab: number[] = [];
      for (let i: number = firstNum ? firstNum : 0; i <= lastNum; i++) {
        tab.push(i);
      }
      return tab;
    }

    useEffect(() => {
      if (previousFrame) {
        setFirstNum(previousFrame.numero + 1);
        setNumeros(listOfNums(firstNum, roll.images))
        setFrameNumber(previousFrame.numero + 1)
      }
    }, [previousFrame])

    console.log("firstNum", firstNum)
    console.log("numeros", numeros)


    // let firstNum: number = previousFrame?.numero ? previousFrame.numero + 1 : 1;
    // const numeros = listOfNums(firstNum, roll.images); 	   


    /* GERER LE SCROLL */
  
    const renderItem = ({ item }: {item: any}) => {
      const isSelected = item === frameNumber || item === numeros[0];
      return (
        <TouchableOpacity onPress={() => setFrameNumber(item)}>
          {/* <View style={{ paddingLeft: 20, paddingRight: 20, borderRadius: 16, opacity: isSelected ? 1 : 0.5, backgroundColor: '#101010' }}> */}
          <View style={isSelected ? { height: 80, width: 80, borderRadius: 100, backgroundColor: '#101010', justifyContent: 'center', alignItems: 'center' } : { height: 80, width: 60, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={isSelected ? { fontSize: 48, color: '#EEEEEE' } : { fontSize: 48, color: '#222222' }}>{item}</Text>
          </View>
        </TouchableOpacity>
      );
    };

    /* CENTRER LA LISTE SUR LE NUMERO SELECTIONNE */

    const flatListRef = useRef<any>(null);

    const scrollToSelectedItem = (item: any) => {
      const index = numeros.indexOf(item);
      if (index >= 0 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: index, animated: true, viewPosition: 0 });
      }
    };
  
    // Appeler la fonction de défilement chaque fois que frameNumber change
    useEffect(() => {
      scrollToSelectedItem(frameNumber);
    }, [frameNumber]);

    /// PRISE DE PHOTO AVEC SON TELEPHONE ///

    useEffect(()=> {

      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

    },[requestCamera])

    async function handlePressOnAddPhotoFromPhone() { 

      if (!hasPermission) { setRequestCamera(true) }
      setModalTakePictureVisible(true);
      setModalAddFrameVisible(false);

    }

    // Prendre une photo //

    const takePicture = async () => {
      const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
      console.log('photo tel uri', photo);

      /// créer un formData pour la photo ///

      const formData: any = new FormData();

      formData.append('photoFromFront', {
        uri: photo.uri,
        name: 'photo.jpg', // CHANGER LE NOM DE LA PHOTO
        type: 'image/jpeg',
        });

        /// ATTENTION AU FETCH FINAL POUR ENREGISTRER FORM DATA + JSON
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/upload`, {
        method: 'POST',
        body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('fetch ', data.result)
          setUrlPhotoFromPhone(data.url);

          setModalTakePictureVisible(false)
          setModalAddFrameVisible(true)

        })
        .catch(error => {
          console.error('Erreur lors du fetch upload photo :', error);
        });

    }

    function handlePressOnSaveFrame(): void {

      console.log('url photo from phone', urlPhotoFromPhone);

      const newFrame = {
        userProfileID: user._id, 
        rollID: roll._id,
        numero: frameNumber,
        shutterSpeed: frameSpeed,
        aperture: frameAperture,
        location: currentAdress,
        date,
        weather,
        camera: camera?._id,
        brand : lensBrand,
        model : lensModel,
        title,
        comment: commentary,
        phonePhoto: urlPhotoFromPhone,
      }
      console.log('new frame : ' , newFrame)

      fetch(`${BACKEND_LOCAL_ADRESS}/frames`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(newFrame),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('fetch ajout frame: ', data.result)
        setUrlPhotoFromPhone(data.url);
        setFramesData(framesData ? [...framesData, data.newFrame] : [])
        setPreviousFrame(data.newFrame);
        setModalAddFrameVisible(false)
      })
      .catch(error => {
        console.error('Erreur lors du post photo :', error);
      });
    }


    function hundlePressOnFrame(frame: FrameType): void {
      
      const selectedFrame = frame;
      selectedFrame.title = !selectedFrame.title? selectedFrame.location : selectedFrame.title;

      setFrameToDisplay(selectedFrame);

    }

    // création des éléments JSX

    const frames = framesData?.map((frame: FrameType, i: number)=> {
            
      //AFFICHER LA LOCALISATION EN CAS D'ABSENCE DE TITRE
      const thisTitle: string = frame.title ? frame.title : frame.location; 

      // AFFICHER L'IMAGE S'iL Y EN A UNE
      const imageURI: string | undefined = frame.argenticPhoto ? frame.argenticPhoto : undefined;

      const date = new Date(frame.date); // conversion en Date de frame.data pour appliquer les get...() dessus

      return (
      <TouchableOpacity key={i} style={styles.frameContainer} onPress={() => {
        setModalViewFrameVisible(true)
        hundlePressOnFrame(frame);
        }}>
          
          {imageURI ? (imageURI.length > 0 && <Image source={{ uri: imageURI}} style={styles.imgStyle}/>) : undefined}
          <View style={styles.frameInfos}>
          <View style={styles.frameNumberContainer}>
              <Text style={styles.frameNumber}>{`${frame.numero}`}</Text>
          </View>
          <View style={styles.textContainer}>
              <Text style={styles.title}>{thisTitle}</Text>
              <Text style={styles.infos}>{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} • ${frame.shutterSpeed} • ${frame.aperture}`}</Text>
          </View>
          </View>
      </TouchableOpacity>
      )
    })


    /// UPLOAD DE LA PHOTO ARGENTIQUE NUMERISEE ///

    const [image, setImage] = useState<string | null>();

    
    // FAIRE ENREGISTREMENT DANS CLOUDINARY

    useEffect(()=> {

      if(image) {

       const formData: any = new FormData();

      formData.append('photoFromFront', {
        uri: image,
        name: 'photo.jpg', // CHANGER LE NOM DE LA PHOTO
        type: 'image/jpeg',
      });

        
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/upload`, {
        method: 'POST',
        body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
          fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frameToDisplay?._id}`, {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({argenticPhoto: data.url}),
          })
          .then((response) => response.json())
          .then((data) => {
          })
          .catch(error => {
            console.error('Erreur lors du put frameToDisplay :', error);
          });
        })
        .catch(error => {
          console.error('Erreur lors du fetch upload argentic photo :', error);
        });
      }

    }, [image])

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('result asset', result.assets ? result.assets[0].uri : 'rien')
      if (result.assets) {
        setImage(result.assets[0].uri);
      }
    };

    /// SUPPRIMER UNE PELICULE ///

    function handlePressOnDeleteRollButton() {

      fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${user._id}/${roll._id}`, { 
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
          dispatch(removeRoll(roll._id))
        }
    })
    .catch(error => {
      console.error('Erreur lors du delete roll :', error);
    });
  }

    /// MODIFIER LA FRAME AFFICHÉE ///

    function handlePressOnModifyFrameButton() {

      // GERER LA MODIFICATION, DONC LE PASSAGE EN MODE EDITION

    }

    /// SUPPRIMER UNE FRAME ///

    function handlePressOnDeleteFrameButton() {

      fetch(`${BACKEND_LOCAL_ADRESS}/frames/${user._id}/${roll._id}/${frameToDisplay?._id}`, { 
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }, 
      })
      .then(response => response.json())
      .then(data => {
          if (data.result) {
          console.log('result fetch delete frame', data.result);
          setModalViewFrameVisible(false);
          }
      })
      .catch(error => {
        console.error('Erreur lors du delete frame :', error);
      });

    }

    function handlePressOnShareButton(displayedFrame: FrameType | undefined) {

      if (frameToDisplay) {
        if (frameToDisplay.argenticPhoto) {
          fetch(`${BACKEND_LOCAL_ADRESS}/frames/${displayedFrame?._id}`, {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({shared: !displayedFrame?.shared}),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('fetch put frameToDisplay succeeded')

          })
          .catch(error => {
            console.error('Erreur lors du put frameToDisplay :', error);
          });


          // et l'icone passe en jaune
        } else {/* message d'erreur pour informer qu'il faut une photo argentique  ALERT */}
      }


    }
    
if (!isLoading) {    
return (

    <View style={styles.body}>
        <SafeAreaView style={styles.headerContainer}>
          <Header navigation={navigation} iconLeft='arrow-back' title={roll.name} iconRight='more-vert' onPressRightButton={() => setContextualMenuVisible(true)}/>
        </SafeAreaView>
        { <ScrollView style={styles.framesContainer}>{frames}</ScrollView> || <Text style={styles.h2}>Ajoutez votre première photo</Text> }
       

        <TouchableOpacity 
            style={styles.addFrameButton} 
            activeOpacity={0.8}
            onPress={handlePressOnPlus}
          >
          <MaterialIcons name="add" size={40} color="#050505"/>
        </TouchableOpacity>
      
        <View style={styles.centeredView}>
          <Modal visible={modalAddFrameVisible} transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* <SafeAreaProvider> */}
                <View style={styles.modalView}>
                  

                    {/* Modal Header */}
                    {/* <SafeAreaView> */}
                     <Header navigation={navigation} iconLeft='close' onPressLeftButton={() => setModalAddFrameVisible(false)} title='Nouvelle photo'/>
                    {/* </SafeAreaView> */}

                    <View style={styles.mainContent}>
                      {/* Modal Text Inputs */}
                      
                      <ScrollView style={styles.scrollView}>
                          {/* Selecteur du numéro de la photo */}
                          <View style={styles.numSelector}>
                            <FlatList
                              ref={flatListRef}
                              data={numeros}
                              style={styles.flatList}
                              renderItem={renderItem}
                              keyExtractor={(item) => item.toString()}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              getItemLayout={(data, index) => ({
                                length: 50, // Hauteur de chaque élément
                                offset: 50 * index, // Calcul de l'espacement entre les éléments
                                index,
                              })}
                              initialScrollIndex={0} // Scroll initial à l'élément sélectionné
                            />
                          </View>

                          {/* Slider vitesse */}

                          <Text style={styles.label}>Vitesse</Text>

                          <Text style={styles.paramsText}>{frameSpeed}”</Text>
                          <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={shutterSpeeds.length -1 } // dernier index du tableau de valeurs shutterSpeeds
                            step={1}
                            value={lastFrameSpeedValue}
                            minimumTrackTintColor="#FFDE67"
                            thumbTintColor="#FFDE67"
                            maximumTrackTintColor="#222222"
                            onValueChange={value => setFrameSpeed(`1/${shutterSpeeds[value]}`)}
                          />
                          <View style={styles.boundariesContainer}>
                            <Text style={styles.minText}>{shutterSpeeds[0]}</Text>
                            <Text style={styles.maxText}>{shutterSpeeds[shutterSpeeds.length -1]}</Text>
                          </View>

                          {/* Slider ouverture */}

                          <Text style={styles.label}>Ouverture</Text>

                          <Text style={styles.paramsText}>{frameAperture}</Text>
                          <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={apertures.length -1 } // dernier index du tableau de valeurs shutterSpeeds
                            step={1}
                            value={lastFrameApertureValue}
                            minimumTrackTintColor="#FFDE67"
                            thumbTintColor="#FFDE67"
                            maximumTrackTintColor="#222222"
                            onValueChange={value => setFrameAperture(`f/${apertures[value]}`)}
                          />
                          <View style={styles.boundariesContainer}>
                            <Text style={styles.minText}>{apertures[0]}</Text>
                            <Text style={styles.maxText}>{apertures[apertures.length -1]}</Text>
                          </View>
                        

                        <View style={styles.inputsGroup1}>

                            {/* Input lieu */}

                            <CustomInput
                              label='Lieu'
                              icon='location-on'
                            >
                              <TextInput
                                placeholder='-'
                                placeholderTextColor='#AAAAAA'
                                value={currentAdress}
                                onChangeText={(value) => handleChangeLocation(value)}
                                style={styles.input}
                                />
                            </CustomInput>

                            {/* Input date */}

                            <CustomInput
                              label='Date'
                              icon='date-range'
                            >
                              <TouchableOpacity onPress={handleChangeDate} style={styles.fakeInput}>
                                {date && <Text style={styles.fakeInputText}>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>}
                              </TouchableOpacity>
                            </CustomInput>

                            {datepickerVisible && (
                              <DateTimePicker
                              value={date}
                              onValueChange={(pickedDate) => console.log('pickedDate :', pickedDate)}
                            />
                            )}

                            {/* Input meteo */}

                            <CustomInput
                              label='Météo'
                              icon='cloud'
                            >
                              <TextInput
                                placeholder='-'
                                placeholderTextColor='#AAAAAA'
                                value={weather}
                                onChangeText={(value) => handleChangeWeather(value)}
                                style={styles.input}
                                />
                            </CustomInput>

                        </View>
                        
                        <View style={styles.inputsGroup1}>

                            {/* Input appareil */}

                            <CustomInput
                              label='Appareil'
                              icon='photo-camera'
                            >
                                <Text style={styles.fakeInputText}>{camera?.brand} - {camera?.model}</Text>
                            </CustomInput>

                            {/* Inputs objectif */}

                            <Text style={styles.label}>Objectif</Text>

                            <CustomInput
                              label='Marque'
                              icon='circle'
                            >
                              <TextInput
                                placeholder='-'
                                placeholderTextColor='#AAAAAA'
                                value={lensBrand? lensBrand : ''}
                                onChangeText={(value) => setLensBrand(value)}
                                style={styles.input}
                                />
                            </CustomInput>

                            <CustomInput
                              label='Modèle'
                              icon='circle'
                            >
                              <TextInput
                                placeholder='-'
                                placeholderTextColor='#AAAAAA'
                                value={lensModel? lensModel : ''}
                                onChangeText={(value) => setLensModel(value)}
                                style={styles.input}
                                />
                            </CustomInput>

                        </View>

                        <View style={styles.inputsGroup1}>

                                {/* Input Nom */}

                                <CustomInput
                                label='Nom'
                                icon='local-offer'
                              >
                                <TextInput
                                  placeholder='-'
                                  placeholderTextColor='#AAAAAA'
                                  value={title}
                                  onChangeText={(value) => setTitle(value)}
                                  style={styles.input}
                                  />
                              </CustomInput>

                                {/* Input commentaire */}

                                <CustomInput
                                label='Commentaire'
                                icon='notes'
                              >
                                <TextInput
                                  placeholder='Ajoutez un commentaire'
                                  placeholderTextColor='#AAAAAA'
                                  value={commentary}
                                  onChangeText={(value) => setCommentary(value)}
                                  style={styles.input}
                                  />
                              </CustomInput>

                        </View>

                        {/* Ajouter une photo depuis son smartphone */}
                        <TouchableOpacity onPress={handlePressOnAddPhotoFromPhone} style={styles.addPhotoContainer}>
                            {urlPhotoFromPhone && <Image source={{ uri: urlPhotoFromPhone }} style={{ width: '100%', height: 200 }} resizeMode='contain'/>}
                            {!urlPhotoFromPhone && (
                              <View style={styles.addPhotoContent}>
                                <MaterialIcons name='add-photo-alternate' size={40} color="#AAAAAA"/>
                                <Text style={styles.addPhotoText}>Ajouter une photo avec mon téléphone</Text>
                              </View>
                            )}
                        </TouchableOpacity>
                        
                      </ScrollView>

                    </View>

                     <View style={styles.saveButtonContainer}>         
                        <CustomButton
                          title="Enregistrer"
                          onPress={handlePressOnSaveFrame}
                          type="primary"
                        />
                      </View>

                </View>
              {/* </SafeAreaProvider> */}
            </KeyboardAvoidingView>    
          </Modal>
        </View>


        <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
        <SafeAreaProvider>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>


              {/* Modal Header */}
              
              <View style={styles.modalHeader}>
                      {
                      frameToDisplay?.shared?
                      
                      <Header navigation={navigation} iconLeft='close' onPressLeftButton={() => setModalViewFrameVisible(false)} title='Remplacer' iconRight='visibility' onPressRightButton={()=> handlePressOnShareButton(frameToDisplay)}/>
                      :
                      <Header navigation={navigation} iconLeft='close' onPressLeftButton={() => setModalViewFrameVisible(false)} title='Remplacer' iconRight='visibility-off' onPressRightButton={()=> handlePressOnShareButton(frameToDisplay)}/>
                    }
          
              </View>
        
              {/* Modal Content */}

              <ScrollView style={styles.scrollView}>
              {/* Image? de l'argentique */}

              <TouchableOpacity onPress={pickImage} style={styles.addPhotoContainer}>
                  {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                  {!image && (
                    <View style={styles.addPhotoContent}>
                      <MaterialIcons name='add-photo-alternate' size={40} color="#AAAAAA"/>
                      <Text style={styles.addPhotoText}>Ajouter la photo numérisée</Text>
                    </View>
                  )}
              </TouchableOpacity>
              

              {/* numero photo / vitesse / ouverture */}

              <View style={styles.inputsGroup2}>
                {/* lieu */}
                <CustomField label='Lieu' icon='location-on' value={frameToDisplay?.location}></CustomField>

                {/* date */}
                <CustomField label='Date' icon='date-range' value={String(frameToDisplay?.date)}></CustomField>

                {/* meteo */}
                <CustomField label='Weather' icon='cloud' value={frameToDisplay?.weather}></CustomField>
              </View>
              <View style={styles.inputsGroup2}>
                {/* appareil */}
                <CustomField label='Appareil' icon='photo-camera' value={`${rollData?.camera.brand} - ${rollData?.camera.model}`}></CustomField>

                {/* objectif */}
                <CustomField label='Objectif' icon='circle' value={`${frameToDisplay?.lens?.brand} - ${frameToDisplay?.lens?.model}`}></CustomField>
              
              </View>
              <View style={styles.inputsGroup2}>
                {/* nom */}
                <CustomField label='Nom' icon='local-offer' value={frameToDisplay?.title}></CustomField>

                {/* commentaire */}
                <CustomField label='Commentaire' icon='notes' value={frameToDisplay?.comment}></CustomField>
              </View>
              {/* photo du téléphone */}
              <TouchableOpacity onPress={handlePressOnAddPhotoFromPhone} style={styles.addPhotoContainer}>
                    <Text>Ajouter une photo avec mon téléphone</Text>
                    <Image source={{ uri: frameToDisplay?.phonePhoto }} style={styles.photo} />
                </TouchableOpacity>

              </ScrollView>

              <View style={styles.bottomButtonContainer}>

                {/* bouton modifier */}
                <CustomButton title='MODIFIER' type='primary' onPress={()=> handlePressOnModifyFrameButton()}></CustomButton>

                {/* bouton supprimer */}

                <TouchableOpacity onPress={handlePressOnDeleteFrameButton} style={styles.trashButtonContainer}>
                  <MaterialIcons name="delete" size={24} color="#FFDE67"/>
                </TouchableOpacity>
              
              </View>
          </View>
          </View>
        </SafeAreaProvider>
        </Modal>

        
        { hasPermission &&
        <Modal visible={modalTakePictureVisible} transparent>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
    
          <Camera type={type} flashMode={flashMode} ref={(ref: any) => cameraRef = ref} style={styles.camera}>
            <View style={styles.photoButtonsContainer}>
            <TouchableOpacity
                onPress={() => setModalTakePictureVisible(false)}
                style={styles.photoButton}
              >
                <FontAwesome name='close' size={25} color='#ffffff' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
                style={styles.photoButton}
              >
                <FontAwesome name='rotate-right' size={25} color='#ffffff' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFlashMode(flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off)}
                style={styles.photoButton}
              >
                <FontAwesome name='flash' size={25} color={flashMode === FlashMode.off ? '#ffffff' : '#e8be4b'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.snapContainer}>
              <TouchableOpacity onPress={() => cameraRef && takePicture()}>
                <FontAwesome name='circle-thin' size={95} color='#ffffff' />
              </TouchableOpacity>
            </View>
          </Camera>
          
        </View>
        </View>
        </Modal>
        }

        {/* <ContextMenu visible={contextMenuVisible} onClose={() => console.log('coucou')} options={[
          { text: 'Option 1', onPress: () => console.log('Option 1 selected') },
          { text: 'Option 2', onPress: () => console.log('Option 2 selected') },
          // Ajoutez d'autres options ici
        ]}/> */}
                
    </View>
    
)} else return (
  <View style={styles.body}>
    <Text>CHARGEMENT</Text>
  </View>
)

}

export default RollScreen;


const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    height:'100%',
    width: '100%',
  },
  headerContainer: {
    height: 130,
    width: '100%',
  }, 
  addFrameButton: {
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
  framesContainer: {
    padding: 24,
    width: '100%',
    gap: 16,
  },
  frameContainer: {
    borderRadius: 12,
    marginBottom: 16,
  },
  frameInfos: {
    flexDirection: 'row',
    backgroundColor: '#101010',
    width: '100%',
    height: 80,
    padding: 16,
    gap:16,
  },
  imgStyle: {
    height: 228,
    width: '100%',
  },
  frameNumberContainer: {
    heigh: 48,
    width: 48,
    borderRadius: 100,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 32,
    color: '#EEEEEE',
  },
  textContainer: {
    flex: 1,
  },
  title: {
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
  input: {
    color: '#EEEEEE',
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    width: 200,
    textAlign: 'right',
  },
  centeredView: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    //marginTop: 1200
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
  mainContent: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    padding: 24,
    gap: 24,
    marginTop: 88,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  saveButtonContainer: {
    padding: 24,
    backgroundColor: '#050505',
    borderTopWidth: 0.5,
    borderTopStyle: 'solid',
    borderTopColor: '#222222'
  },
  numSelector: {
    justifyContent: 'center',
     alignItems: 'center', /*backgroundColor: 'green',*/
     width: '100%',
     height: 88,
  },
  flatList: {
    height: 100, /*backgroundColor: 'red',*/
    width: 300, /*marginLeft: -150*/
  },
  paramsText:{
    color: '#EEEEEE',
    fontSize: 40,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  boundariesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  minText: {
    color: '#EEEEEE',
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    fontWeight: '300',
    lineHeight: 24,
  },
  maxText: {
    color: '#EEEEEE',
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    fontWeight: '300',
    lineHeight: 24,
  },
  inputsGroup1: {
    width: '100%',
    height: 'auto',
    borderRadius: 12,
    gap: -1,
    borderColor: '#050505',
    borderWidth: 0.5,
    marginBottom: 24,
  },
  inputsGroup2: {
    width: '100%',
    height: 'auto',
    borderRadius: 12,
    gap: -1,
    borderColor: '#222222',
    borderWidth: 0.5,
  },
  fakeInput: {
    marginBottom: 20,
    backgroundColor: '#101010',
    height: 48,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '30%',
    alignItems: 'center',
  },
  label: {
    marginTop: 24,
    color: '#AAAAAA',
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    
  },
  fakeInputText: {
    color: '#EEEEEE',
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    // width: '70%',
  },
  addPhotoContainer: {
    borderRadius: 8,
    // boderColor: 'white',
    // borderWidth: 1,
    // borderStyle: 'dashed',
    // width: '100%',
    // height: 104,
    // backgroundColor: '#050505',
    backgroundColor: '#050505',
    height: 144,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  addPhotoContent: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    borderColor: '#222222',
    borderWidth: 1,
    borderStyle: 'dashed',
    height: 144,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  photoButtonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  photoButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
  },
  snapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
  photo: {
    margin: 10,
    width: 150,
    height: 150,
  },
  addPhotoText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    color: '#AAAAAA',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  trashButtonContainer: {
    width: 80,
  }
})