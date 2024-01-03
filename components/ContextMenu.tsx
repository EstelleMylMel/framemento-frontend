import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

type Option = {
  text: string;
  onPress: () => void;
};

type ContextMenuProps = {
  visible: boolean;
  onClose: () => void;
  options: Option[];
};

const ContextMenu: React.FC<ContextMenuProps> = ({ visible, onClose, options }) => {
    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <TouchableOpacity style={styles.container} onPress={onClose}>
            <View style={styles.menu}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={option.onPress}
                >
                  <Text style={styles.text}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      );
    };

    export default ContextMenu;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      menu: {
        backgroundColor: '#050505',
        borderRadius: 16,
        padding: 10,
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
      },
      menuItem: {
        paddingVertical: 30,
      },
      text: {
        textAlign: 'center',
        color: '#EEEEEE',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
      },
    });


