// Therapist.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Therapist = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Custom Header with Drawer Toggle */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Therapist</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.text}>Therapist Screen</Text>
      </View>
    </View>
  );
};

export default Therapist;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { fontSize: 22, fontWeight: '600', color: '#333' },
});
