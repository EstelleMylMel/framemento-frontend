import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationProp, ParamListBase, useRoute, RouteProp} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

// IMPORTS TYPES //
import { RollType } from '../types/roll';
import { CameraType } from '../types/camera';
import { LensType } from '../types/lens';
import { UserState } from '../reducers/user';
import { FrameType } from '../types/frame';
import { RootStackParamList } from '../App';


//IMPORTS COMPOSANTS CUSTOM //
import CustomInput from '../components/CustomInput';
import { current } from '@reduxjs/toolkit';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

// Typage du contenu des paramètres de la route
type RollScreenProps = {
    navigation: NavigationProp<RootStackParamList>,
    route: RouteProp<RootStackParamList, 'Roll'>
  };

//  export default function RollScreen({ navigation, route: { params: { roll }} }: RollScreenProps) {
  const RollScreen: React.FC<RollScreenProps> = ({ navigation, route }) => {
    
    // Récupération des informations de la pellicule
    const { roll } = route.params;
    console.log('roll: ', roll._id);

    /// ON/OFF MODALES ///
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ datepickerVisible, setDatepickerVisible ] = useState<boolean>(false);


    /// ROLL AND FRAMES DATA ///
    const [ rollData, setRollData ] = useState<RollType | undefined>();
    const [ framesData, setFramesData ] = useState<FrameType[] | undefined>();
    const [ previousFrame, setPreviousFrame ] = useState<FrameType | undefined>(framesData && framesData.length > 0 ? framesData[framesData?.length - 1] :  undefined);

    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [ currentAdress, setCurrentAdress ] = useState<string>('');

    /// INPUTS VARIABLES & FONCTIONS ///
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
    const [camera, setCamera] = useState<CameraType | undefined>();
    const [ lens, setLens ] = useState<LensType| undefined>(previousFrame ? previousFrame.lens : undefined);

    const [ title, setTitle ] = useState<string>('');
    const [ commentary, setCommentary ] = useState<string>('');

    useEffect(()=>{

        /// Récuper le contenu de la pellicule
        fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${roll._id}`)
        .then(response => response.json())
        .then(rollData => {
          console.log('fetch : ', rollData.result);
            if (rollData.result) {
              
                setRollData(rollData.roll);
                rollData !== undefined ? setFramesData(rollData.framesList) : undefined;
                console.log('camera : ', rollData.roll.camera)

              fetch(`${BACKEND_LOCAL_ADRESS}/material/cameras/657b118d4445a231efb6532c`)  //${rollData.roll.camera} 
              .then(response => response.json())
              .then(cameraData => {
                console.log(cameraData)
                cameraData? setCamera(cameraData) : console.log('no data : ', cameraData)
              })
              .catch(error => {
                console.error('Erreur lors du fetch camera :', error);
              });

            } else console.log('no data : ', rollData);

        })
        .catch(error => {
            console.error('Erreur lors du fetch :', error);
          });


    },[])

    // si framesData ne vaut pas undefined, on map.

    const frames = framesData?.map((frame: FrameType)=> {
            
            let title: string;
            frame.title !== undefined ? title = frame.title : title = 'Trouver quoi mettre'; //ATTENTION PENSER LA LOGIQUE EN CAS D'ABSENCE DE TITRE

            let imageURI: string | undefined;
            frame.argenticPhoto ? imageURI = frame.argenticPhoto : imageURI = frame.phonePhoto;

            return (
            <View style={styles.frameTale}>
                <Image source={{ uri: imageURI}}/>
                <View style={styles.frameNumberContainer}>
                    <Text style={styles.frameNumber}>{`${frame.numero}`}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.infos}>{`${frame.date.getDate()}/${frame.date.getMonth()}/${frame.date.getFullYear()} . ${frame.shutterSpeed} . ${frame.aperture}`}</Text>
                </View>
            </View>
            )
        })

    function handlePressOnPlus(): void {

        setModalVisible(true);

        /// geoloc & date actuelles ///
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status === 'granted') {
            Location.watchPositionAsync({ distanceInterval: 10 },
              (location) => {
                setLatitude(location.coords.latitude);
                setLongitude(location.coords.longitude);
                setDate(new Date(location.timestamp));
              });
          }
        })();

        /// Obtenir l'adresse à partir des données de geoloc
        fetch(`https://api-adresse.data.gouv.fr/reverse/?lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then((data)=> {
          setCurrentAdress(data.features[0].properties.label);
        })
        .catch(error => {
          console.error('Erreur lors du fetch api data gouv :', error);
        });

        /// Obtenir la météo actuelle
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/weather/${latitude}/${longitude}`)
        .then(response => response.json())
				.then(data => {
          console.log('meteo : ',data.weather);
            setWeather(data.weather);
        })
        .catch(error => {
          console.error('Erreur lors du fetch api weather app :', error);
        });

    };
    
    function handlePressOnX(): void {
    setModalVisible(false)
    };

    function handleChangeLens(): void {
      //Afficher la liste des objectifs
    }

    function handlePressOnSaveFrame(): void {

    }

    

    
return (
    <View style={styles.body}>
        {/*<Header></Header>*/}

        { frames || <Text style={styles.h2}>Ajoutez votre première photo</Text> }

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
                  <Text style={styles.textModalHeader}>Nouvelle photo</Text>
                </View>

                {/* Modal Text Inputs */}

                {/* Selecteur du numéro de la photo */}

                {/* Slider vitesse */}

                {/* Slider ouverture */}

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
                  <Text style={styles.fakeInputText}>{camera?.brand} - {camera?.model} coucou</Text>
                </View>

    
                

                {/* Input objectif */}

                <TouchableOpacity onPress={handleChangeLens} style={styles.fakeInput}>
                <Text style={styles.label}>Objectif</Text>
                 { lens? <Text style={styles.fakeInputText}>{lens.model}</Text> : <Text style={styles.fakeInputText}>-</Text>}
                </TouchableOpacity>

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

                {/* Ajouter des photos */}
                  
                  </View>
                  </View>
                </Modal>

                
          {/* </Modal> */}
        
        <TouchableOpacity style={styles.addButton} onPress={()=> handlePressOnPlus()}>
            <Text>+</Text>
        </TouchableOpacity>
        
            
                  
    </View>
    
);

}

export default RollScreen;


const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } , 
  h2: {},
    addButton:{
      height: 40,
      width: 40,
      backgroundColor: 'grey',
      alignItems: 'center',
      justifyContent: 'center',
    },
  frameTale: {},
  frameNumberContainer: {},
  frameNumber: {},
  textContainer: {},
  title: {},
  infos: {},
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
  enregistrerButton: {},
})