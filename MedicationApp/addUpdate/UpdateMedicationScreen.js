import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/contants';

const UpdateMedicationScreen = ({ route }) => {
    const { id, name, dosageUnits, dosage, notes } = route.params;

    
  const navigation = useNavigation();
  const [_name, setName] = useState(name);
  const [_dosageUnits, setDosageUnits] = useState(dosageUnits);
  const [_dosage, setDosage] = useState(dosage);
  const [_notes, setNotes] = useState(notes);

  const handleUpdateMedication = async () => {
    if ( !_name || !_dosageUnits || !_dosage || !_notes) {
      alert('Please fill in all required fields.');
      return;
    }

    try {


      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${BASE_URL}medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: _name,
          dosageUnits: _dosageUnits,
          dosage: _dosage,
          notes: _notes
        })
      });

      
      const data = await response.json();
      console.log('Medication updated:', data);

      alert('Successfully Updated.');
      navigation.goBack()
    
    } catch (error) {
      console.error('Error adding medication:', error);
     
    }
  };

  return (
    <View style={styles.container}>
      
      <TextInput
        value={_name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={_dosageUnits}
        onChangeText={setDosageUnits}
        placeholder="Dosage Units"
        style={styles.input}
      />
      <TextInput
        value={_dosage}
        onChangeText={setDosage}
        placeholder="Dosage"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        value={_notes}
        onChangeText={setNotes}
        placeholder="Notes"
        style={styles.input}
      />
<TouchableOpacity style={styles.button} onPress={handleUpdateMedication}>
        <Text style={styles.buttonText}>Update Medication</Text>
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

export default UpdateMedicationScreen;