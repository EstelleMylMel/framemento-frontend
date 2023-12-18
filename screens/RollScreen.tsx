import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, ScrollView, FlatList } from 'react-native';
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
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

// Typage du contenu des paramètres de la route
type RollScreenProps = {
    navigation: NavigationProp<RootStackParamList>,
    route: RouteProp<RootStackParamList, 'Roll'>
  };

//  export default function RollScreen({ navigation, route: { params: { roll }} }: RollScreenProps) {
  const RollScreen: React.FC<RollScreenProps> = ({ navigation, route }) => {

    // Chargement des fonts ///
    const [fontsLoaded] = useFonts({
      'Poppins-Medium': require('../assets/fonts/poppins/Poppins-Medium.ttf'),
      'Poppins-Light': require('../assets/fonts/poppins/Poppins-Light.ttf')
    });
    
    const user = useSelector((state: { user: UserState }) => state.user.value);

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
    


    /// ROLL AND FRAMES DATA ///
    const [ rollData, setRollData ] = useState<RollType | undefined>();
    const [ framesData, setFramesData ] = useState<FrameType[] | undefined>(); // à chaque ajout de photo on ajoute 1 dans ce tableau.
    const [ previousFrame, setPreviousFrame ] = useState<FrameType | undefined>(framesData && framesData.length > 0 ? framesData[framesData?.length - 1] :  undefined);

    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [ currentAdress, setCurrentAdress ] = useState<string>('');

    /// INPUTS VARIABLES & FONCTIONS ///

    const [ frameNumber, setFrameNumber ] = useState<number | undefined >(previousFrame?.numero ? previousFrame.numero +1 : 1);


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

    const [date, setDate] = useState<Date | undefined>();
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
                console.log('camera : ', rollData.roll.camera)

              fetch(`${BACKEND_LOCAL_ADRESS}/material/cameras/${rollData.roll.camera}`)  //${rollData.roll.camera} 
              .then(response => response.json())
              .then(cameraData => {
                console.log('cameraData :', cameraData)
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

      /// INITIALISER LES SLIDERS A LA BONNE POSITION

      // setLastFrameSpeedValue(shutterSpeeds.findIndex((speed)=> speed == 1/Number(frameSpeed)));
      // setLastFrameApertureValue(apertures.findIndex((aperture)=> `f/${aperture}` == frameAperture));

      })
    }, []);


    function handlePressOnPlus(): void {

        setModalAddFrameVisible(true);

        /// geoloc & date actuelles ///
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status === 'granted') {
            Location.watchPositionAsync({ distanceInterval: 10 },
              (location) => {
                setLatitude(location.coords.latitude);
                setLongitude(location.coords.longitude);
                setDate(new Date(location.timestamp));
                console.log(date)
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

    /// CAROUSEL DE NUMEROS DE PHOTO ///

    /* CREER LA LISTE DE NUMEROS */
    function listOfNums(firstNum: number | undefined, lastNum: number) {
      const tab: number[] = [];
      for (let i: number = firstNum ? firstNum : 0; i <= lastNum; i++) {
        tab.push(i);
      }
      return tab;
    }

    let firstNum: number = previousFrame?.numero ? previousFrame.numero + 1 : 1;
    
    const numeros = listOfNums(firstNum, roll.images); 	   


    /* GERER LE SCROLL */
  
    const renderItem = ({ item }: {item: any}) => {
      const isSelected = item === frameNumber;
      return (
        <TouchableOpacity onPress={() => setFrameNumber(item)}>
          <View style={{ paddingLeft: 20, paddingRight: 20, borderRadius: 16, opacity: isSelected ? 1 : 0.5, backgroundColor: '#101010' }}>
            <Text style={{ fontSize: 50, color: 'white' }}>{item}</Text>
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

    function handlePressOnAddPhotoFromPhone() { 

      setModalAddFrameVisible(false);
      setModalTakePictureVisible(true);

      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

      if (!hasPermission) {
        return <View></View>;
      }

      return (
        <Modal visible={modalTakePictureVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>

          <Camera type={type} flashMode={flashMode} ref={(ref: any) => cameraRef = ref} style={styles.camera}>
            <View style={styles.photoButtonsContainer}>
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
              <TouchableOpacity onPress={() => cameraRef && (takePicture(), setModalTakePictureVisible(false), setModalAddFrameVisible(true))}>
                <FontAwesome name='circle-thin' size={95} color='#ffffff' />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
        </View>
        </Modal>
      );

    }

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
          //dispatch(addPhoto(data.url));
        })
        .catch(error => {
          console.error('Erreur lors du fetch upload photo :', error);
        });
      
    }

    function handlePressOnSaveFrame(): void {

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
      console.log(newFrame)

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
        setModalAddFrameVisible(false);
      })
      .catch(error => {
        console.error('Erreur lors du post photo :', error);
      });
    }


    function hundlePressOnFrame(frame: FrameType): void {
      

      fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}`)
          .then(response => response.json())
          .then(data => {

            setFrameToDisplay(frame);

          })
          .catch(error => {
            console.error('Erreur lors du fetch frame cliquée :', error);
          });


    }

    // si framesData ne vaut pas undefined, on map.

    const frames = framesData?.map((frame: FrameType, i: number)=> {
            
      let title: string;
      frame.title !== undefined ? title = frame.title : title = 'Trouver quoi mettre'; //ATTENTION PENSER LA LOGIQUE EN CAS D'ABSENCE DE TITRE

      let imageURI: string | undefined;
      frame.argenticPhoto ? imageURI = frame.argenticPhoto : imageURI = frame.phonePhoto;

      const date = new Date(frame.date); // conversion en Date de frame.data pour appliquer les get...() dessus

      return (
      <TouchableOpacity key={i} style={styles.frameContainer} onPress={() => {
        setModalViewFrameVisible(true)
        hundlePressOnFrame(frame);
        }}>
          {imageURI ? (imageURI.length > 0 && <Image source={{ uri: imageURI}} style={styles.imgStyle}/>) : undefined}
          <View style={styles.frameNumberContainer}>
              <Text style={styles.frameNumber}>{`${frame.numero}`}</Text>
          </View>
          <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.infos}>{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} . ${frame.shutterSpeed} . ${frame.aperture}`}</Text>
          </View>
      </TouchableOpacity>
      )
    })


    /// UPLOAD DE LA PHOTO ARGENTIQUE NUMERISEE ///

    const [image, setImage] = useState<string | null>();

    
    // FAIRE ENREGISTREMENT DANS CLOUDINARY

    useEffect(()=> {

      if(image) {

      
       console.log('uri image argentique ', image)

       const formData: any = new FormData();

      formData.append('photoFromFront', {
        uri: image,
        name: 'photo.jpg', // CHANGER LE NOM DE LA PHOTO
        type: 'image/jpeg',
      });

      console.log('form data append  ', formData)
      console.log('form data append  ', formData._parts[0][1].uri)

        /// ATTENTION AU FETCH FINAL POUR ENREGISTRER FORM DATA + JSON
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/upload`, {
        method: 'POST',
        body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
          // fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frameToDisplay?._id}`, {
          //   method: 'PUT',
          //   headers: { 'Content-Type' : 'application/json'},
          //   body: JSON.stringify({argenticPhoto: data.url}),
          // })
          // .then((response) => response.json())
          // .then((data) => {
          //   console.log('fetch put frameToDisplay succeeded')
          // })
          // .catch(error => {
          //   console.error('Erreur lors du put frameToDisplay :', error);
          // });
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


    /// MODIFIER LA FRAME AFFICHÉE ///

    function handlePressOnModifyFrameButton() {

    }

    function handleShareButton() {

      if (frameToDisplay) {
        if (frameToDisplay.argenticPhoto) {
          fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frameToDisplay?._id}`, {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({shared: true}),
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

    
    
return (
    <View style={styles.body}>
        {/*<Header></Header>*/}

        { <ScrollView style={styles.framesContainer}>{frames}</ScrollView> || <Text style={styles.h2}>Ajoutez votre première photo</Text> }
        

        <TouchableOpacity 
            style={styles.addFrameButton} 
            activeOpacity={0.8}
            onPress={handlePressOnPlus}
          >
          <MaterialIcons name="add" size={40} color="#050505" style={{ borderRadius: 15 }}/>
        </TouchableOpacity>

        <Modal visible={modalAddFrameVisible} animationType="fade" transparent>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
                

                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    onPress={() => setModalAddFrameVisible(false)} 
                    style={styles.closeModalButton} 
                    activeOpacity={0.8}
                  >
                    <FontAwesome name='times' style={styles.closeModalIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textModalHeader}>Nouvelle photo</Text>
                </View>

                <ScrollView>
                {/* Modal Text Inputs */}

                {/* Selecteur du numéro de la photo */}
                <View style={{ justifyContent: 'center', alignItems: 'center', /*backgroundColor: 'green',*/ width: 300 }}>
                  <FlatList
                    ref={flatListRef}
                    data={numeros}
                    style={{ height: 100, /*backgroundColor: 'red',*/ width: 300, /*marginLeft: -150*/ }}
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
                  <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 20, color: 'white', /*marginLeft: -150*/ }}>
                    Nombre sélectionné : {frameNumber}
                  </Text>
                </View>

                {/* Slider vitesse */}

                <Text style={styles.paramsText}>{frameSpeed}</Text>
                <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={shutterSpeeds.length -1 } // dernier index du tableau de valeurs shutterSpeeds
                  step={1}
                  value={lastFrameSpeedValue}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  onValueChange={value => setFrameSpeed(`1/${shutterSpeeds[value]}`)} //
                />
                <Text style={styles.minText}>{shutterSpeeds[0]}</Text>
                <Text style={styles.maxText}>{shutterSpeeds[shutterSpeeds.length -1]}</Text>

                {/* Slider ouverture */}

                <Text style={styles.paramsText}>{frameAperture}</Text>
                <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={apertures.length -1 } // dernier index du tableau de valeurs shutterSpeeds
                  step={1}
                  value={lastFrameApertureValue}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  onValueChange={value => setFrameAperture(`f/${value}`)}
                />
                <Text style={styles.minText}>{apertures[0]}</Text>
                <Text style={styles.maxText}>{apertures[shutterSpeeds.length -1]}</Text>
                

                <View style={styles.inputsGroup}>

                    {/* Input lieu */}

                    <CustomInput
                        label="Lieu"
                        icon={<Text>👤</Text>}
                        value={currentAdress}
                        onChange={(value) => handleChangeLocation(value)}
                        // style={{
                        // container: { marginVertical: 10 },
                        // label: { fontSize: 16, fontWeight: 'bold' },
                        // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                        // iconContainer: { marginRight: 10 },
                        // icon: { fontSize: 20 },
                        // }}
                    />

                    {/* Input date */}

                    <TouchableOpacity onPress={handleChangeDate} style={styles.fakeInput}>
                      <View style={styles.labelContainer}>
                        {/* AJOUTER ICONE */}
                        <Text style={styles.label}>Date</Text>
                      </View>
                      <Text style={styles.fakeInputText}>{date?.getDay()}/{date?.getMonth()}/{date?.getFullYear()}</Text>
                    </TouchableOpacity>

                    {datepickerVisible && (
                      <DateTimePicker
                      value={date}
                      onValueChange={(pickedDate) => console.log(pickedDate)}
                    />
                    )}

                    {/* Input meteo */}

                    <CustomInput
                        label="Météo"
                        icon={<Text>👤</Text>}
                        value={weather}
                        onChange={(value) => handleChangeWeather(value)}
                        // style={{
                        // container: { marginVertical: 10 },
                        // label: { fontSize: 16, fontWeight: 'bold' },
                        // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                        // iconContainer: { marginRight: 10 },
                        // icon: { fontSize: 20 },
                        // }}
                    />
                </View>
                <View style={styles.inputsGroup}>

                {/* Input appareil */}

                <View style={styles.fakeInput}>
                  <View style={styles.labelContainer}>
                      {/* AJOUTER ICONE */}
                      <Text style={styles.label}>Appareil</Text>
                  </View>
                  <Text style={styles.fakeInputText}>{camera?.brand} - {camera?.model}</Text>
                </View>

                {/* PROBLEME AFFICHAGE CAMERA */}

                {/* Inputs objectif */}

                <Text style={styles.label}>Objectif</Text>

                <CustomInput
                      label="Brand"
                      icon={<Text>👤</Text>}
                      value={lensBrand? lensBrand : ''}
                      onChange={(value) => setLensBrand(value)}
                      // style={{
                      // container: { marginVertical: 10 },
                      // label: { fontSize: 16, fontWeight: 'bold' },
                      // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                      // iconContainer: { marginRight: 10 },
                      // icon: { fontSize: 20 },
                      // }}
                  />

                <CustomInput
                      label="Model"
                      icon={<Text>👤</Text>}
                      value={lensModel? lensModel : ''}
                      onChange={(value) => setLensModel(value)}
                      // style={{
                      // container: { marginVertical: 10 },
                      // label: { fontSize: 16, fontWeight: 'bold' },
                      // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                      // iconContainer: { marginRight: 10 },
                      // icon: { fontSize: 20 },
                      // }}
                  />

                </View>
                <View style={styles.inputsGroup}>
                  {/* Input Nom */}
                  <CustomInput
                      label="Nom"
                      icon={<Text>👤</Text>}
                      value={title}
                      onChange={(value) => setTitle(value)}
                      // style={{
                      // container: { marginVertical: 10 },
                      // label: { fontSize: 16, fontWeight: 'bold' },
                      // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                      // iconContainer: { marginRight: 10 },
                      // icon: { fontSize: 20 },
                      // }}
                  />


                  {/* Input commentaire */}
                  <CustomInput
                      label="Commentaire"
                      placeholder='Ajoutez un commentaire'
                      icon={<Text>👤</Text>}
                      value={commentary}
                      onChange={(value) => setCommentary(value)}
                      // style={{
                      // container: { marginVertical: 10 },
                      // label: { fontSize: 16, fontWeight: 'bold' },
                      // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                      // iconContainer: { marginRight: 10 },
                      // icon: { fontSize: 20 },
                      // }}
                  />
                </View>

                {/* Ajouter une photo depuis son smartphone */}
                  <TouchableOpacity onPress={handlePressOnAddPhotoFromPhone} style={styles.addPhotoContainer}>
                      <Text>Ajouter une photo avec mon téléphone</Text>
                  </TouchableOpacity>

                  </ScrollView>

                  <CustomButton
                    title="Enregistrer"
                    onPress={handlePressOnSaveFrame}
                    type="primary"
                  />

                  </View>
                  </View>
                
                
        </Modal>


        <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
              <View style={styles.centeredView}>
              <View style={styles.modalView}>


              {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    onPress={() => setModalViewFrameVisible(false)} 
                    style={styles.closeModalButton} 
                    activeOpacity={0.8}
                  >
                    <FontAwesome name='times' style={styles.closeModalIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textModalHeader}>Nouvelle photo</Text>
                  {/* bouton partager */}
                  <TouchableOpacity 
                    onPress={() => handleShareButton()} 
                    style={styles.closeModalButton} 
                    activeOpacity={0.8}
                  >
                    <FontAwesome name='eye' style={styles.shareIcon} />
                  </TouchableOpacity>
                </View>

                <ScrollView>
                {/* Image? de l'argentique */}

                <TouchableOpacity onPress={pickImage} style={styles.addPhotoContainer}>
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                    {!image && <Text>Ajouter la photo numérisée</Text>}
                </TouchableOpacity>
                

                {/* numero photo / vitesse / ouverture */}

                {/* lieu */}
                <CustomField label='Lieu' icon='' value={frameToDisplay?.location}></CustomField>

                {/* date */}
                <CustomField label='Date' icon='' value={String(frameToDisplay?.date)}></CustomField>

                {/* meteo */}
                <CustomField label='Weather' icon='' value={frameToDisplay?.weather}></CustomField>

                {/* appareil */}
                <CustomField label='Appareil' icon='' value={`${rollData?.camera.brand} - ${rollData?.camera.model}`}></CustomField>

                {/* objectif */}
                <CustomField label='Objectif' icon='' value={`${frameToDisplay?.lens?.brand} - ${frameToDisplay?.lens?.model}`}></CustomField>
                
                {/* nom */}
                <CustomField label='Nom' icon='' value={frameToDisplay?.title}></CustomField>

                {/* commentaire */}
                <CustomField label='Commentaire' icon='' value={frameToDisplay?.comment}></CustomField>

                </ScrollView>
                {/* bouton modifier */}
                
                <CustomButton title='' type='primary' onPress={()=> handlePressOnModifyFrameButton()}></CustomButton>

                {/* bouton supprimer */}


              </View>

              </View>
        </Modal>
        
            
                  
    </View>
    
);

}

export default RollScreen;


const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  } , 
  h2: {},
  addFrameButton: {
    height: 80,
    width: 80,
    backgroundColor: '#FFDE67',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  framesContainer: {
    padding: 24,
    width: '100%',
    gap: 16,
  },
  frameContainer: {
    flexDirection: 'row',
    backgroundColor: '#101010',
    width: '100%',
    height: 80,
    padding: 16,
    borderRadius: 12,
    gap:16,
  },
  imgStyle: {
    height: 228,
    widht: '100%',
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

  centeredView: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      padding: 24,
  },
  modalView: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    padding: 24,
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
  paramsText:{
    color: '#EEEEEE',
    fontSize: 40,
  },
  minText: {
    color: '#EEEEEE',
    fontSize: 12,
  },
  maxText: {
    color: '#EEEEEE',
    fontSize: 12,
  },
  inputsGroup: {
    flex:1,
    width: '100%',
    height: 'auto',
    borderRadius: 12,
  },
  fakeInput: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#101010',
    height: 48,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '30%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#EEEEEE',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    
  },
  fakeInputText: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    alignContent: 'flex-end',
    color: '#EEEEEE',
    fontSize: 14,
    width: '70%',
    backgroundColor: '#101010'
  },
  addPhotoContainer: {
    borderRadius: 8,
    boderColor: '#AAAAAA',
    borderWidth: 1,
    borderStyle: 'dashed',
    width: '100%',
    height: 104,
    backgroundColor: 'white'
  },
  camera: {
    flex: 1,
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
  enregistrerButton: {},
})