import React, { useState } from 'react';
import { View,Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { BASE_URL } from '../utils/contants';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignup = async () => {

    //validations for name, email and password
    if (!name.trim() || !email.trim() || !password.trim()) {
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
      const response = await fetch(`${BASE_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Signup successful, return to login screen
        alert("User Register Successfully");
        navigation.navigate('Login');
      } else {
        // Signup failed, display error message
        const errorData = await response.json();
        Alert.alert('Signup Failed', errorData.message);
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

<Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

<TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    width: '90%',
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
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

export default SignUpScreen;
