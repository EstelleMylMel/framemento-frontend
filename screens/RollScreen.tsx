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
import { UserState } from '../reducers/user';
import { FrameType } from '../types/frame';
import { RootStackParamList } from '../App';


//IMPORTS COMPOSANTS CUSTOM //
import CustomInput from '../components/CustomInput';
import { current } from '@reduxjs/toolkit';



const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;
const OWM_API_KEY = process.env.EXPO_PUBLIC_OWM_API_KEY;

// Typage du contenu des paramètres de la route
type RollScreenProps = {
    navigation: NavigationProp<RootStackParamList>,
    route: RouteProp<RootStackParamList, 'Roll'>
  };

//  export default function RollScreen({ navigation, route: { params: { roll }} }: RollScreenProps) {
  const RollScreen: React.FC<RollScreenProps> = ({ navigation, route }) => {
    const { roll } = route.params;
 
    // Récupération des informations de la pellicule

    const [ rollData, setRollData ] = useState<RollType | undefined>();
    const [ framesData, setFramesData ] = useState<FrameType[] | undefined>();

    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ datepickerVisible, setDatepickerVisible ] = useState<boolean>(false);

    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [ currentAdress, setCurrentAdress ] = useState<string>('');
    const [ title, setTitle ] = useState<string>('');

    /// INPUTS ///
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


    useEffect(()=>{

        /// Récuper le contenu de la pellicule
        fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${roll._id}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setRollData(data.roll);
                rollData !== undefined ? setFramesData(rollData.framesList) : undefined;
                console.log(data.roll) //
            } else console.log('no data : ', data);
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
                console.log('latitude : ',location.coords.latitude);
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

    function handlePressOnSaveFrame(): void {

    }

    
return (
    <View>
        {/*<Header></Header>*/}

        { frames || <Text style={styles.h2}>Ajoutez votre première photo</Text> }

        {/* <Modal visible={modalVisible} animationType="fade" transparent> */}
            {/* <View style={styles.centeredView}>
              <View style={styles.modalView}>

                {/* Modal Header */}
                {/* <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    onPress={() => handlePressOnX()} 
                    style={styles.closeModalButton} 
                    activeOpacity={0.8}
                  >
                    <FontAwesome name='times' style={styles.closeModalIcon} />
                  </TouchableOpacity>
                  <Text style={styles.textModalHeader}>Nouvelle photo</Text>
                </View> */}
              

                {/* Modal Text Inputs */}

                {/* Selecteur du numéro de la photo */}

                {/* Slider vitesse */}

                {/* Slider ouverture */}

                {/* Input lieu */}

                <CustomInput
                    label="Lieu"
                    icon={<Text>👤</Text>}
                    value={location.adress}
                    onChange={handleChangeLocation}
                    // style={{
                    // container: { marginVertical: 10 },
                    // label: { fontSize: 16, fontWeight: 'bold' },
                    // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                    // iconContainer: { marginRight: 10 },
                    // icon: { fontSize: 20 },
                    // }}
                />

                {/* Input date */}

                <TouchableOpacity onPress={handleChangeDate}>
                  <Text>{date?.getDay()}/{date?.getMonth()}/{date?.getFullYear()}</Text>
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
                    onChange={handleChangeWeather}
                    // style={{
                    // container: { marginVertical: 10 },
                    // label: { fontSize: 16, fontWeight: 'bold' },
                    // inputContainer: { flexDirection: 'row', alignItems: 'center' },
                    // iconContainer: { marginRight: 10 },
                    // icon: { fontSize: 20 },
                    // }}
                />

                {/* Input appareil */}

                {/* Input objectif */}

                {/* Input Nom */}

                {/* Input appareil */}

                
          {/* </Modal> */}
        
        <TouchableOpacity style={styles.addButton} onPress={()=> handlePressOnPlus()}>
            <Text>+</Text>
        </TouchableOpacity>
        
            
                  
    </View>
    
);

}

export default RollScreen;


const styles = StyleSheet.create({
    h2: {},
    addButton:
     {

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
      enregistrerButton: {
  
      },
})