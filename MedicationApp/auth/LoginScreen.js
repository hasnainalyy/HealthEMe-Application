import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/contants';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken){
        navigation.navigate('Medication');
      }
    };

    getToken();
  }, []);

  const handleRegister = async () => {
    navigation.navigate('Register');
  }

  const handleLogin = async () => {

    //validations
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password should be at least 6 characters long.');
      return;
    }
   
//network call
    try {
        const response = await fetch(`${BASE_URL}login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          const json = await response.json();
      
          // check if login successful
          if (json.token) {
            // save user data to async storage
            await AsyncStorage.setItem('user', json.user._id);
            await AsyncStorage.setItem('token', json.token);
      
            // navigate to medications screen
            navigation.navigate('Medication');
          } else {
            // handle login error
            console.log(json.message)
            alert(json.message);
          }
      
    } catch (error) {
        if (error.response) {
         alert('Server Error');
          console.error('Server Error:', error.response.status);
        } else if (error.request) {
            alert('Network Error');
          console.error('Network Error:', error.request);
        } else {
            alert('Error');
          console.error('Error:', error.message);
        }
      };
  
  

  };

  const isValidEmail = (email) => {
    // Basic email validation using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    width: '90%'
  },
  button: {
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 4,
    marginTop: 24
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});