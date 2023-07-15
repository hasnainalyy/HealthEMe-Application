import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/contants';


export default function HomeScreen() {
  const navigation = useNavigation();
  const [medications, setMedications] = useState([]);
  const [token, setToken] = useState('');
  const [storedUserId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchMedications = async () => {
    try {
      let url = `${BASE_URL}medications`;
  
      if (searchQuery) {
        url += `?name=${searchQuery}`;
      }

      if (sortOrder) {
        url += `${searchQuery ? '&' : '?'}sortBy=${sortOrder}`;
      }
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleSort = () => {
    toggleSortOrder();
    fetchMedications();
  };


  
  const handleAdd = () => {
    navigation.navigate('AddMedication');
  };

  const handleUpdate = (id, name, dosageUnits, dosage, notes) => {
    navigation.navigate('UpdateMedication', {
      id: id,
      name: name,
      dosageUnits: dosageUnits,
      dosage: dosage,
      notes: notes
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${BASE_URL}medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const updatedMedications = medications.filter((medication) => medication._id !== id);
      setMedications(updatedMedications);
    } catch (error) {
      console.error('Error deleting medication:', error);
      Alert.alert('Error', 'Failed to delete medication.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  useEffect(() => {
    const getUserPref = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('user');

      setUserId(storedUserId);
      setToken(storedToken);
    };

    getUserPref();
  }, []);

  useEffect(() => {
    if (token) {
      fetchMedications();
    }
  }); 


  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>
          {item.dosage} {item.dosageUnits}
        </Text>
        <Text style={styles.medicationNotes}>{item.notes}</Text>

        {storedUserId == item.user._id ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}
              onPress={() => {
                handleUpdate(item._id, item.name, item.dosageUnits, item.dosage, item.notes);
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}
              onPress={() => {
                Alert.alert(
                  'Confirm Deletion',
                  `Are you sure you want to delete ${item.name}?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                    {
                      text: 'Delete',
                      onPress: () => handleDelete(item._id)
                    }
                  ]
                );
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          ''
        )}
        <View style = {styles.lineStyle} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.navigationBar, { paddingTop: 16 }]}>
        <Text style={styles.navigationBarTitle}>All Medications</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleAdd}>
          <Text style={styles.logoutButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ marginHorizontal: 16, marginTop:16 }}>Filter by name:</Text>
        <TextInput
          style={{ flex: 1,  marginTop:16, height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8, marginRight:16 }}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />


      </View>
      <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
      <Text style={styles.sortButtonText}>Sort: {sortOrder === 'desc' ? 'Ascending' : 'Descending'}</Text>
    </TouchableOpacity>
     
      <FlatList
        data={medications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>No Medications Found.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      navigationBar: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: '',
        backgroundColor: 'black',
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
      navigationBarTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginRight:58
      },
      logoutButton: {
        padding: 8,
        marginHorizontal:8,
        backgroundColor: 'red',
        borderRadius: 4,
      },
      logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
      },
    title: {
      marginTop: 24,
      marginHorizontal: 12,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20
    },
    medicationContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 4
    },
    medicationName: {
        marginBottom:8,
      fontSize: 20,
      fontWeight: 'bold'
    },
    medicationDosage: {
        marginBottom:8,
      fontSize: 16
    },
    medicationNotes: {
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom:8
    },
    button: {
      marginHorizontal: 12,
      backgroundColor: 'blue',
      padding: 12,
      borderRadius: 4,
      marginBottom: 16
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18
    },
    sortButton: {
      marginHorizontal: 12,
      backgroundColor: 'gray',
      padding: 12,
      borderRadius: 4,
      marginBottom: 16
    },
    sortButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center'
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'gray',
        marginTop:16,
   }
  });
