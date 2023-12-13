import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

// IMPORTS TYPES //
import { RollType } from '../types/roll';
import { UserState } from '../reducers/user';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type RollScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function RollScreen({ navigation }: RollScreenProps) {

    const rollID = ''; // récupérer dans les props.

    const rollData: RollType[] = useSelector((state: { user: UserState })=> {
        if (state.user.value.rolls) {
        state.user.value.rolls.find((roll: RollType)  => roll._id === rollID)
        }
    });


    useEffect(()=>{

        /// Récuper le contenu de la pellicule
        fetch(`${BACKEND_LOCAL_ADRESS}/rolls/${rollID}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                //setRollData(data.roll);
            } else console.log('no data : ', data);
        })
        .catch(error => {
            console.error('Erreur lors du fetch :', error);
          });

    },[])

    const [ rollIsEmpty, setRollIsEmpty ] = useState<boolean>(true);

    const handleAddButton = () :void  => {

    }

    const noRoll = (
        <Text style={styles.h2}>Ajoutez votre première photo</Text>
    );

    const roll = (
        <View>

        </View>
    )

    
return (
    <View>
        {/*<Header></Header>*/}

        { rollIsEmpty && noRoll}
        { !rollIsEmpty && roll }
        
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
    
})