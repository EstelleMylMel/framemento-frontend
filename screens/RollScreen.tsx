import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useEffect, useState } from 'react';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

// IMPORTS TYPES //
import { RollType } from '../types/roll';
import { UserState } from '../reducers/user';
import { FrameType } from '../types/frame';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type RollScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function RollScreen({ navigation }: RollScreenProps) {

    const rollID = ''; // récupérer dans les props.

    const [ rollData, setRollData ] = useState<RollType | undefined>();
    const [ framesData, setFramesData ] = useState<FrameType[] | undefined>();


    useEffect(()=>{

        /// Récuper le contenu de la pellicule
        fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${rollID}`)
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

    const [ rollIsEmpty, setRollIsEmpty ] = useState<boolean>(true);

    const handleAddButton = () :void  => {

    }

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

    
return (
    <View>
        {/*<Header></Header>*/}

        { frames || <Text style={styles.h2}>Ajoutez votre première photo</Text> }
        
        <TouchableOpacity style={styles.addButton} onPress={()=> handleAddButton()}>
            <Text>+</Text>
        </TouchableOpacity>
        
            
                  
    </View>
    
);

}



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
})