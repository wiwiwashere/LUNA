import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle; // customizable
  textStyle? : TextStyle;
}

const ButtonComponent: React.FC<ButtonProps> = ({ onPress, title, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 25,
    width: 250,
    padding: 15,
    backgroundColor: '#F0EbE7',
    borderRadius: 10,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 30,
    color: '#3E5368',
    textAlign: 'center',
    fontFamily: 'Aboreto',
  },
});

export default ButtonComponent;