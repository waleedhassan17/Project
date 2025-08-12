import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks'; 
import { selectMessage, setMessage } from './homeScreenSlice';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectMessage);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});