import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './auth/LoginScreen';
import AddMedicationScreen from './addUpdate/AddMedicationScreen';
import UpdateMedicationScreen from './addUpdate/UpdateMedicationScreen';
import HomeScreen from './home/HomeScreen';
import SignUpScreen from './auth/SignUpScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
           <Stack.Screen
          name="Register"
          component={SignUpScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="Medication"
          component={HomeScreen}
          options={{ title: '' }}
        />
           <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{ title: 'Add Medication' }}
        />
        <Stack.Screen
          name="UpdateMedication"
          component={UpdateMedicationScreen}
          options={{ title: 'Update Medication' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}