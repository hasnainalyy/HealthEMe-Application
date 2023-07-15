import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/contants';

const AddMedicationScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [dosageUnits, setDosageUnits] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddMedication = async () => {
    if (!name || !dosageUnits || !dosage || !notes) {
      alert('Please fill in all required fields.');
      return;
    }

    try {


      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`${BASE_URL}medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          name,
          dosageUnits,
          dosage,
          notes,
        })
      });

      const data = await response.json();
      console.log('Medication added:', data);

      alert('Successfully Added.');
      navigation.goBack()
      
    } catch (error) {
      console.error('Error adding medication:', error);
    
    }
  };

  return (
    <View style={styles.container}>
      
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={dosageUnits}
        onChangeText={setDosageUnits}
        placeholder="Dosage Units"
        style={styles.input}
      />
      <TextInput
        value={dosage}
        onChangeText={setDosage}
        placeholder="Dosage"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        style={styles.input}
      />
<TouchableOpacity style={styles.button} onPress={handleAddMedication}>
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>

  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16
  },

  button: {
    marginTop: 16,
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 4,
    marginTop: 16
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default AddMedicationScreen;